/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request as RequestBase, Response as ResponseBase } from 'express';

export function request(body: any = null, params: any = null, query: any = null): RequestBase {
	return {
		body,
		params,
		query,
	} as any;
}

export function response(): ResponseBase & { current_body: any } {
	const result: any = {
		current_body: null,
		statusCode: 0,
	};
	result.json = function (newBody: any) {
		if (result.statusCode === 0) result.statusCode = 200;
		result.current_body = newBody;
	};
	result.status = function (newStatus: number) {
		result.statusCode = newStatus;
	};
	result.sendStatus = function (newStatus: number) {
		result.statusCode = newStatus;
	};

	return result;
}
