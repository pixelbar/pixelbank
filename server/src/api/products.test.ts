/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { DI } from '../database';
import { request, response } from '../utils/test';
import { createContext, configure, close as cleanup } from '../database';
import * as api from './products';
import { Product } from '../models/product';
import { expect, test } from '@jest/globals';

test('Ensure product list is loaded', async (done) => {
	await configure(true);
	createContext(async () => {
		const res = response();
		await api.getProductList(request(), res);

		expect(res.statusCode).toBe(200);

		const expected_count = await DI.productRepository.count();
		const actual = (res.current_body as Product[]).length;

		expect(expected_count).toBe(actual);

		await cleanup();

		done!();
	});
});

test('Ensure product can be loaded by code', async (done) => {
	await configure(true);
	createContext(async () => {
		const products = await DI.productRepository.findAll();
		const product = products[Math.floor(Math.random() * products.length)];

		const res = response();
		await api.getProductByCode(request(null, { code: product.code }), res);

		expect(res.statusCode).toBe(200);

		const loaded_product = res.current_body as Product;

		expect(loaded_product.code).toBe(product.code);
		expect(loaded_product.id).toBe(product.id);
		expect(loaded_product.name).toBe(product.name);
		expect(loaded_product.price).toBe(product.price);

		await cleanup();

		done!();
	});
});

test('Ensure product will fail with invalid code request', async () => {
	let res = response();
	await api.getProductByCode(request(null, { co_de: '1234' }), res);

	expect(res.statusCode).toBe(400);

	res = response();
	await api.getProductByCode(request(), res);

	expect(res.statusCode).toBe(400);
});
