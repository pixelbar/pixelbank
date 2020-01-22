import express from 'express';
import cors from 'cors';
import { configure as databaseConfigure, seed as seedDatabase } from './database';
import { configure as apiUsersConfigure } from './api/users';
import { configure as apiProductsConfigure } from './api/products';

const app = express();

console.log('Configuring database...');
databaseConfigure(app).then(() => {
	if (process.argv.some(a => a == '--seed')) {
		console.log('Seeding database');
		seedDatabase()
			.then(() => {
				console.log('Database is seeded');
				process.exit(0);
			})
			.catch(e => {
				console.error('Could not seed database');
				console.error(e);
				process.exit(1);
			});
		return;
	}

	console.log('Configuring web api...');
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	apiUsersConfigure(app);
	apiProductsConfigure(app);
	app.listen(2345);
	console.log('Server listening on localhost:2345');
});
