import { IProduct, IPerson } from './data';
import * as rp from 'request-promise-native';

function parseJson<T>(v: string): T | null {
	if (v.length == 0) {
		return null;
	} else {
		return JSON.parse(v);
	}
}

class Api {
	async getProductById(id: string): Promise<IProduct | null> {
		if (id.indexOf('/') != -1 || id.indexOf('\\') != -1) {
			return null;
		}
		const result = await rp.get(process.env.PIXELBANK_SERVER + '/api/product/' + id);
		return parseJson(result);
	}

	async getUserByName(name: string): Promise<IPerson | null> {
		if (name.indexOf('/') != -1 || name.indexOf('\\') != -1) {
			return null;
		}
		const result = await rp.get(process.env.PIXELBANK_SERVER + '/api/user/' + name);
		return parseJson(result);
	}
}

export const api = new Api();
