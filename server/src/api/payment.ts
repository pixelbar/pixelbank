import { Express, Request, Response } from 'express';
import { DI } from '../database';
import { Product } from '../models/product';
import { Payment } from '../models/payment';
import { PaymentItem } from '../models/paymentItem';

async function getUserPayments(req: Request, res: Response): Promise<void> {
	const userName: string = req.params.userName;
	const count: number = parseInt(req.query.count) || 100;

	const user = await DI.userRepository.findOne({ name: userName });
	if (user == null) {
		res.json({
			error: `User '${userName}' not found`
		});
		return;
	}

	const payments = await DI.paymentRepository.find(
		{ user },
		{ populate: ['items'], limit: count, orderBy: { date: 'DESC' } }
	);

	res.json({
		user,
		payments,
		count,
	});
}

interface AddUserPaymentBody {
	products: string[];
}

async function addUserPayment(req: Request, res: Response): Promise<void> {
	const userName: string = req.params.userName;
	const body = req.body as AddUserPaymentBody;
	if (!Array.isArray(body.products)) {
		res.json({
			error: "Missing required field 'products'",
		});
		return;
	}

	const user = await DI.userRepository.findOne({ name: userName });
	if (user == null) {
		res.json({
			error: `User '${user}' not found`,
		});
		return;
	}

	const productList: Product[] = [];
	let productAmount = 0;
	for (const productCodeOrId of body.products) {
		const product: Product | null = await DI.productRepository.findOne({
			$or: [{ id: productCodeOrId }, { code: productCodeOrId }],
		});
		if (product == null) {
			res.json({
				error: `Could not find product which has code or id ${productCodeOrId}`,
			});
			return;
		}

		productList.push(product);
		productAmount += product.price;
	}

	user.balance -= productAmount;
	const payment = new Payment(user);
	for (const product of productList) {
		payment.items.add(new PaymentItem(payment, product));
	}

	await DI.paymentRepository.persist(payment);
	await DI.paymentRepository.flush();

	await payment.items.init();
	res.json({
		user,
		payment
	});
}

export function configure(e: Express): void {
	e.route('/api/payments/:userName')
		.get(getUserPayments)
		.post(addUserPayment);
}
