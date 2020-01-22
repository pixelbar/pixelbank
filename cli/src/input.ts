import * as readline from 'readline';
require('dotenv').config();

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

export function prompt(question: string): Promise<string> {
	return new Promise((resolve, reject) => {
		rl.question(question, answer => {
			if (answer.length === 0) {
				reject('No input');
			} else {
				resolve(answer);
			}
		});
	});
}
