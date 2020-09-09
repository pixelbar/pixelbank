import { AnyEntity, Entity, PrimaryKey, Property, OneToMany, Collection } from 'mikro-orm';
import { Payment } from './payment';
import { v4 } from 'uuid';
import { Transaction } from './transaction';

@Entity()
export class User implements AnyEntity<User, 'id'> {
	@PrimaryKey()
	id: string;

	@Property()
	name: string;

	@Property()
	balance: number;

	@OneToMany(() => Payment, (payment) => payment.user)
	payments = new Collection<Payment>(this);
	
	@OneToMany(() => Transaction, (transaction) => transaction.from_user)
	transactions_out = new Collection<Transaction>(this);

	@OneToMany(() => Transaction, (transaction) => transaction.to_user)
	transactions_in = new Collection<Transaction>(this);

	constructor(name: string) {
		this.id = v4();
		this.name = name;
		this.balance = 0;
	}
}
