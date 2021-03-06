import { Entity, PrimaryKey, Property } from 'mikro-orm';
import { v4 } from 'uuid';

@Entity()
export class Product {
	@PrimaryKey()
	id: string;

	@Property()
	name: string;

	@Property()
	code: string;

	@Property()
	price: number;

	constructor(code: string, name: string, price: number) {
		this.id = v4();
		this.code = code;
		this.name = name;
		this.price = price;
	}
}
