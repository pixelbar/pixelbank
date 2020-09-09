import { Entity, PrimaryKey, Property, OneToMany, Collection } from 'mikro-orm';
import { Payment } from './payment';
import { v4 } from 'uuid';

@Entity()
export class User {
	@PrimaryKey()
	id: string;

	@Property()
	name: string;

	@Property()
	balance: number;

	@OneToMany(() => Payment, (payment) => payment.user)
	payments = new Collection<Payment>(this);

	constructor(name: string) {
		this.id = v4();
		this.name = name;
		this.balance = 0;
	}
}
