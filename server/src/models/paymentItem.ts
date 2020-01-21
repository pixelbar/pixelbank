import { PrimaryKey, Entity, Property, ManyToOne, OneToMany, Collection } from "mikro-orm";
import { Payment } from "./payment";
import { Product } from "./product";
import uuid from "uuid/v4";

@Entity()
export class PaymentItem {
    @PrimaryKey()
    id: string;

    @ManyToOne()
    payment: Payment;

    @PrimaryKey()
    product_id: string;

    @Property()
    product_name: string;

    @Property()
    product_code: string;

    @Property()
    product_price: number;

    constructor(payment: Payment, product: Product) {
        this.id = uuid();
        this.payment = payment;
        this.product_id = product.id;
        this.product_name = product.name;
        this.product_code = product.code;
        this.product_price = product.price;
    }
}