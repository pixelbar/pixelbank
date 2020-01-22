import { AnyEntity, Entity, PrimaryKey, Property, OneToMany, Collection } from 'mikro-orm';
import uuid from 'uuid/v4';
import { Payment } from './payment';

@Entity()
export class User implements AnyEntity<User, 'id'> {
	@PrimaryKey()
	id: string;

	@Property()
	name: string;

	@Property()
	balance: number;

	@OneToMany(
		() => Payment,
		payment => payment.user
	)
	payments = new Collection<Payment>(this);

	constructor(name: string) {
		this.id = uuid();
		this.name = name;
		this.balance = 0;
	}
}
