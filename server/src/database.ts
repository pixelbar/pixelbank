import { RequestContext, EntityManager, EntityRepository, MikroORM } from 'mikro-orm';
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
		readFile('products.txt', { encoding: 'utf-8' }, (err: NodeJS.ErrnoException | null, data: string) => {
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
			.map((v) => v.trim())
			.filter((v) => !!v);

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

export function registerMiddleware(app: Express): void {
	// configure each express request to have a unique instance of MikroORM
	app.use((_req, _res, next) => {
		createContext(next);
	});
}

export async function configure(inMemory = false): Promise<void> {
	dotenvConfig();

	let forceReseed = false;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const config: any = {
		entities: [Payment, PaymentItem, Product, User],
		baseDir: __dirname,
		autoFlush: false,
	};

	if (inMemory) {
		config.type = 'sqlite';
		config.dbName = ':memory:';

		forceReseed = true;
	} else if (!process.env.DATABASE_URL) {
		console.log('Missing .env variable DATABASE_URL');
		console.log('Will use a temporary sqlite database. This should not be used in production');

		await new Promise((res) => unlink('pixelbank.sqlite', res));
		config.type = 'sqlite';
		config.dbName = 'pixelbank.sqlite';
		config.debug = true;

		forceReseed = true;
	} else {
		config.type = 'postgresql';
		config.dbName = 'pixelbank';
		config.clientUrl = process.env.DATABASE_URL;
	}

	const orm = await MikroORM.init(config);

	DI.orm = orm;
	DI.em = DI.orm.em;
	configureDIRepositories();
	if (forceReseed) {
		await seed();
	}
}

export function createContext(next: () => void): void {
	RequestContext.create(DI.orm.em, next);
}

export async function close(): Promise<void> {
	await DI.orm.close();
}
