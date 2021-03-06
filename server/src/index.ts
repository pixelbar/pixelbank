import express from 'express';
import cors from 'cors';
import {
	configure as databaseConfigure,
	registerMiddleware as registerDatabaseMiddleware,
	seed as seedDatabase,
} from './database';
import { configure as apiPaymentConfigure } from './api/payment';
import { configure as apiUsersConfigure } from './api/users';
import { configure as apiProductsConfigure } from './api/products';

async function init() {
	console.log('Configuring database...');
	await databaseConfigure();

	if (process.argv.some((a) => a == '--seed')) {
		console.log('Seeding database');
		await seedDatabase();
		console.log('Database is seeded');
		process.exit(0);
	}

	const app = express();

	console.log('Configuring web api...');
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	registerDatabaseMiddleware(app);

	apiUsersConfigure(app);
	apiProductsConfigure(app);
	apiPaymentConfigure(app);
	app.listen(2345);
	console.log('Server listening on localhost:2345');
}

init();
