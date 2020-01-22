import { PrimaryKey, Entity, Property, ManyToOne, OneToMany, Collection } from 'mikro-orm';
import { User } from './user';
import { PaymentItem } from './paymentItem';
import uuid = require('uuid');

@Entity()
export class Payment {
	@PrimaryKey()
	id: string;

	@ManyToOne()
	user: User;

	@Property()
	date: Date;

	@OneToMany(
		() => PaymentItem,
		item => item.payment
	)
	items = new Collection<PaymentItem>(this);

	constructor(user: User) {
		this.id = uuid();
		this.user = user;
		this.date = new Date();
	}
}
