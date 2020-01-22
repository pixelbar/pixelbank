export interface Product {
	id: string;
	code: string;
	name: string;
	description: string;
	price: number;
	stock: number | null;
}

export class Product implements Product {
	id: string;
	code: string;
	name: string;
	description: string;
	price: number;
	stock: number | null;

	constructor() {
		this.id = '';
		this.code = '';
		this.name = '';
		this.description = '';
		this.price = 0;
		this.stock = null;
	}
}
