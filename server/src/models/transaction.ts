import { PrimaryKey, Entity, Property, ManyToOne } from 'mikro-orm';
import { User } from './user';
import { v4 } from 'uuid';

@Entity()
export class Transaction {
    @PrimaryKey()
    id: string;

    @ManyToOne()
    from_user: User | null;

    @ManyToOne()
    to_user: User | null;

    @Property()
    date: Date;

    @Property()
    amount: number;

    constructor(from: User | null, to: User | null, amount: number) {
        this.id = v4();
        this.date = new Date();
        this.from_user = from;
        this.to_user = to;
        this.amount = amount;
    }
}
