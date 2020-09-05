import { PrimaryKey, Entity, Property, ManyToOne } from 'mikro-orm';
import { Payment } from './payment';
import { Product } from './product';
import uuid from 'uuid';

@Entity()
export class PaymentItem {
	@PrimaryKey()
	id: string;

	@ManyToOne()
	payment: Payment;

	@PrimaryKey()
	productId: string;

	@Property()
	productName: string;

	@Property()
	productCode: string;

	@Property()
	productPrice: number;

	constructor(payment: Payment, product: Product) {
		this.id = uuid.v4();
		this.payment = payment;
		this.productId = product.id;
		this.productName = product.name;
		this.productCode = product.code;
		this.productPrice = product.price;
	}
}
