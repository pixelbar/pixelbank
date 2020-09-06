import { Request, Response } from 'express';
import { ParsedQs } from 'qs';

function extractRequestObject(req: Request, res: Response, fields: [string]): boolean {
	if (typeof req.body != 'object' || req.body === null || req.body === undefined) {
		res.json({ success: false, message: 'Missing JSON body' });
		return false;
	}
	for (const field of fields) {
		if (!req.body.hasOwnProperty(field)) {
			res.json({ success: false, message: 'Missing one or multiple fields', fields });
			return false;
		}
	}
	return true;
}

function parseQueryAsInt(query: undefined | string | string[] | ParsedQs | ParsedQs[]): number | null {
	if (!query) {
		return null;
	}
	if (typeof query == 'string') {
		const result = parseInt(query);
		if (isNaN(result)) return null;
		return result;
	}
	if (Array.isArray(query)) {
		return parseQueryAsInt(query[0]);
	}
	// query is ParsedQs, which is an object of values
	return null;
}

export { extractRequestObject, parseQueryAsInt };
