import { MikroORM, RequestContext, EntityManager, EntityRepository, Options as MikroOptions } from 'mikro-orm';
import { config as dotenvConfig } from 'dotenv';
import { Express } from 'express';
import { User } from './models/user';
import { Product } from './models/product';
import { Payment } from './models/payment';
import { readFile, unlink } from 'fs';
import { PaymentItem } from './models/paymentItem';

export const DI = {} as {
	orm: MikroORM;
	em: EntityManager;
	userRepository: EntityRepository<User>;
	productRepository: EntityRepository<Product>;
	paymentRepository: EntityRepository<Payment>;
};

function configureDIRepositories(): void {
	DI.userRepository = DI.orm.em.getRepository(User);
	DI.productRepository = DI.orm.em.getRepository(Product);
	DI.paymentRepository = DI.orm.em.getRepository(Payment);
}

export async function seed(): Promise<void> {
	const generator = DI.orm.getSchemaGenerator();
	console.log('Updating schema...');
	await generator.updateSchema();

	console.log('Filling products...');

	const file: string = await new Promise((res, rej) => {
		readFile('products.txt', { encoding: 'UTF8' }, (err, data) => {
			if (err) rej(err);
			else res(data.toString());
		});
	});

	let firstProduct: Product | null = null;

	for (let line of file.split('\n')) {
		line = line.trim();
		if (line.length == 0 || line.startsWith('#')) continue;
		const parts = line
			.split(/(  |\t)/)
			.map(v => v.trim())
			.filter(v => !!v);
		console.log(parts);
		if (parts.length != 3) {
			console.error('Could not insert');
			continue;
		}

		const code = parts[0];
		const price = parseFloat(parts[1]);
		const name = parts[2];

		const product = new Product(code, name, price);
		if (firstProduct === null) {
			firstProduct = product;
		}

		await DI.productRepository.persist(product);
	}

	if (firstProduct != null) {
		const user = new User('Trangar');
		const payment = new Payment(user);
		payment.items.add(new PaymentItem(payment, firstProduct));

		await DI.userRepository.persist(user);
		await DI.paymentRepository.persist(payment);
	}
	await DI.productRepository.flush();
}

export async function configure(app: Express): Promise<void> {
	dotenvConfig();

	let config: MikroOptions;
	let forceReseed = false;
	if (!process.env.DATABASE_URL) {
		console.log('Missing .env variable DATABASE_URL');
		console.log('Will use a temporary sqlite database. This should not be used in production');

		await new Promise(res => unlink('pixelbank.sqlite', res));

		config = {
			entitiesDirs: ['./models'],
			entitiesDirsTs: ['../src/models'],
			baseDir: __dirname,
			autoFlush: false,
			type: 'sqlite',
			dbName: 'pixelbank.sqlite',
			debug: true,
		};
		forceReseed = true;
	} else {
		config = {
			entitiesDirs: ['./models'],
			entitiesDirsTs: ['../src/models'],
			baseDir: __dirname,
			autoFlush: false,
			dbName: 'pixelbank',
			type: 'postgresql',
			clientUrl: process.env.DATABASE_URL,
		};
	}

	const orm = await MikroORM.init(config);

	DI.orm = orm;
	DI.em = DI.orm.em;
	configureDIRepositories();

	// configure each express request to have a unique instance of MikroORM
	app.use((req, res, next) => {
		RequestContext.create(DI.orm.em, next);
	});

	if (forceReseed) {
		await seed();
	}
}
