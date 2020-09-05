import { configure, close, createContext, DI, registerMiddleware } from './database';
import express from 'express';

test('Inject express middleware', () => {
	const app = express();
	registerMiddleware(app);

	// The `app._router.stack` now contains several items
	// Most of them are express internals, but one of them is our middleware for the database
	// it is named '<anonymouse>'

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const middleware: any = app._router.stack.find((l: any) => l.name === '<anonymous>');
	expect(middleware).not.toBeNull();
});

test('Valid database to be set up', async (done) => {
	await configure(true);

	createContext(async () => {
		expect(await DI.userRepository.count()).toBe(1); // we should have 1 user
		expect(await DI.paymentRepository.count()).toBe(1); // we should have one payment
		expect(await DI.productRepository.count()).toBeGreaterThan(0); // we should have some products

		await close();
		done();
	});
});
