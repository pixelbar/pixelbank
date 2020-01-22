import { Express, Request, Response } from 'express';
import { extractRequestObject as requestBodyContainsFields } from '../utils';
import { DI } from '../database';
import { User } from '../models/user';

async function getUserList(req: Request, res: Response): Promise<void> {
	const users = await DI.userRepository.findAll();
	res.json(users);
}

async function createUser(req: Request, res: Response): Promise<void> {
	if (!requestBodyContainsFields(req, res, ['name'])) return;
	const user = new User(req.body.name);
	await DI.userRepository.persistAndFlush(user);

	res.json({ success: true, user });
}

async function getUserByName(req: Request, res: Response): Promise<Response> {
	const name = req.params.name;
	if (!name) return res.json({ success: false, message: "Missing parameter 'name'" });
	const user = await DI.userRepository.findOne({ name: name });
	return res.json({ success: user != null, user });
}

export function configure(e: Express): void {
	e.route('/api/users/').get(getUserList);
	e.route('/api/user').post(createUser);
	e.route('/api/user/:name').get(getUserByName);
}
