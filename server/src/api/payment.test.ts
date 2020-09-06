/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { DI } from '../database';
import { request, response } from '../utils/test';
import { createContext, configure, close as cleanup } from '../database';
import * as api from './payment';
import { Payment } from '../models/payment';
import { expect, test } from '@jest/globals';
import { User } from '../models/user';

test('Ensure payment history can be loaded', async (done) => {
	await configure(true);
	createContext(async () => {
		const res = response();
		await api.getUserPayments(request(null, { userName: 'Trangar' }), res);

		expect(res.statusCode).toBe(200);

		const body = res.current_body as {
			user: User;
			payments: Payment[];
			count: number;
		};

		expect(body.user.name).toBe('Trangar');
		expect(body.payments.length).toBe(1);
		expect(body.count).toBe(100);

		await cleanup();

		done!();
	});
});

test('Ensure payment history request fails on a wrong request', async (done) => {
	await configure(true);
	createContext(async () => {
		const res = response();
		await api.getUserPayments(request(), res);

		expect(res.statusCode).toBe(400);

		await cleanup();

		done!();
	});
});

test('Ensure payment history request fails on a non-existing user', async (done) => {
	await configure(true);
	createContext(async () => {
		const res = response();
		await api.getUserPayments(request(null, { userName: 'Tran_gar' }), res);

		expect(res.statusCode).toBe(200);

		const body = res.current_body as {
			error: string;
		};

		expect(body.error).toBeTruthy();

		await cleanup();

		done!();
	});
});

test('Ensure a payment can be added', async (done) => {
	await configure(true);
	createContext(async () => {
		const all_products = await DI.productRepository.findAll();
		// pick 2 products at random
		const products = [
			all_products[Math.floor(Math.random() * all_products.length)],
			all_products[Math.floor(Math.random() * all_products.length)],
		];

		const res = response();
		await api.addUserPayment(
			request(
				{
					products: [products[0].code, products[1].code],
				},
				{ userName: 'Trangar' }
			),
			res
		);

		expect(res.statusCode).toBe(200);

		const body = res.current_body as {
			user: User;
			payment: Payment;
		};

		expect(body.user.name).toBe('Trangar');
		expect(body.payment.user.name).toBe('Trangar');
		expect(body.payment.items.length).toBe(2);

		let expected_balance = 0;

		for (const item of body.payment.items) {
			// products don't have to be in the same order
			const product = products.find((p) => p.id == item.productId);
			expect(product).not.toBeUndefined();
			expect(item.productName).toBe(product!.name);
			expect(item.productPrice).toBe(product!.price);

			// We bought this so we subtract the price from the balance
			expected_balance -= item.productPrice;
		}

		expect(body.user.balance).toBe(expected_balance);

		await cleanup();

		done!();
	});
});

test('Ensure payment request are properly validated', async (done) => {
	await configure(true);
	createContext(async () => {
		let res = response();
		await api.addUserPayment(request(), res); // no parameters
		expect(res.statusCode).toBe(400);

		res = response();
		await api.addUserPayment(request(null, { userName: 'Trangar' }), res); // no products
		expect(res.statusCode).toBe(400);

		res = response();
		await api.addUserPayment(request({}, { userName: 'Trangar' }), res); // no products
		expect(res.statusCode).toBe(400);
		expect(res.current_body.error).toBeTruthy();

		res = response();
		await api.addUserPayment(request({ products: [] }, { userName: 'Tran_gar' }), res); // no valid user
		expect(res.statusCode).toBe(400);
		expect(res.current_body.error).toBeTruthy();

		res = response();
		await api.addUserPayment(request({ products: ['abc'] }, { userName: 'Trangar' }), res); // Product not found
		expect(res.statusCode).toBe(400);
		expect(res.current_body.error).toBeTruthy();

		// Our user should still have balance 0 after all of this
		const user = await DI.userRepository.findOne({ name: 'Trangar' });
		expect(user!.balance).toBe(0);

		// With the single starting payment
		const payments = await DI.paymentRepository.find({ user });
		expect(payments.length).toBe(1);

		await cleanup();
		done!();
	});
});
