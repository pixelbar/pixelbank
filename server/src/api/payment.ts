import { Express, Request, Response } from 'express';
import { DI } from '../database';

async function getUserPayments(req: Request, res: Response): Promise<void> {
	const userName: string = req.params.userName;
	const count: number = parseInt(req.query.count) || 100;

	const user = await DI.userRepository.findOne({ name: userName });
	if (user == null) {
		res.json({});
		return;
	}
	const payments = await DI.paymentRepository.find({ user }, ['items'], undefined, count);
	res.json({
		user,
		payments,
		count,
	});
}

export function configure(e: Express): void {
	e.route('/api/payments/:userName').get(getUserPayments);
}
