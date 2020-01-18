import { Entity, PrimaryKey, Property } from "mikro-orm";
import uuid from "uuid/v4";

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
        this.id = uuid();
        this.code = code;
        this.name = name;
        this.price = price;
    }
}

