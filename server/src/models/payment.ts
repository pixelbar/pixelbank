import { PrimaryKey, Entity, Property, ManyToOne, OneToMany, Collection } from 'mikro-orm';
import { User } from './user';
import { PaymentItem } from './paymentItem';

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
}
