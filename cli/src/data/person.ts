export interface Person {
	id: string;
	name: string;
	balance: number;
}

export class Person implements Person {
	id: string;
	name: string;
	balance: number;

	constructor() {
		this.id = '';
		this.name = '';
		this.balance = 0;
	}
}
