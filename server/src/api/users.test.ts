import * as api from './users';
import { configure, createContext, close as cleanupDatabase, DI } from '../database';
import { request, response } from '../utils/test';
import { User } from '../models/user';

test('User list', async (done) => {
	await configure(true);
	createContext(async () => {
		const res = response();
		await api.getUserList(request(), res);
		expect(res.statusCode).toBe(200);

		const users = res.current_body as User[];
		expect(users).not.toBeNull();

		// Default seed is 1 user named "Trangar" with a balance of 0.00
		expect(users.length).toBe(1);

		const user = users[0];
		expect(user.name).toBe('Trangar');
		expect(user.balance).toBe(0);

		await cleanupDatabase();

		done();
	});
});

test('Create user with valid body to succeed', async (done) => {
	await configure(true);
	createContext(async () => {
		let users = await DI.userRepository.findAll();
		expect(users.length).toBe(1); // Assert that the default seed has only 1 user

		const res = response();
		await api.createUser(request({ name: 'Test 123' }), res);
		expect(res.statusCode).toBe(200);

		const user = res.current_body as { success: boolean; user: User };

		expect(user.success).toBe(true);
		expect(user.user.name).toBe('Test 123');
		expect(user.user.balance).toBe(0);

		users = await DI.userRepository.findAll();
		expect(users.length).toBe(2); // We added a new user

		await cleanupDatabase();

		done();
	});
});

test('Create user with invalid body to fail', async () => {
	let res = response();
	await api.createUser(request({ na_me: 'Test 123' }), res); // typo in required field "name"

	expect(res.statusCode).toBe(400);

	res = response();
	await api.createUser(request(), res); // no body

	expect(res.statusCode).toBe(400);
});

test('Get user by name to succeed', async (done) => {
	await configure(true);
	createContext(async () => {
		const users = await DI.userRepository.findAll();
		expect(users.length).toBe(1); // Assert that the default seed has only 1 user

		const res = response();
		await api.getUserByName(request(null, { name: 'Trangar' }), res); // Default seed includes a user named 'Trangar'

		expect(res.statusCode).toBe(200);
		const user = res.current_body as { success: boolean; user: User };

		expect(user.success).toBe(true);
		expect(user.user.name).toBe('Trangar');

		await cleanupDatabase();
		done();
	});
});

test('Get user by invalid name to not be found', async (done) => {
	await configure(true);
	createContext(async () => {
		const users = await DI.userRepository.findAll();
		expect(users.length).toBe(1); // Assert that the default seed has only 1 user

		const res = response();
		await api.getUserByName(request(null, { name: 'Foo' }), res); // Default seed includes a user named 'Trangar'

		expect(res.statusCode).toBe(200);
		const user = res.current_body as { success: boolean; user: User | null };

		expect(user.success).toBe(false);
		expect(user.user).toBe(null);

		await cleanupDatabase();
		done();
	});
});

test('Get user by invalid response to fail', async () => {
	const res = response();
	await api.getUserByName(request(), res); // no request params

	expect(res.statusCode).toBe(400);
});
