import { Entity, PrimaryKey, Property, IEntity } from "mikro-orm";

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
        this.code = code;
        this.name = name;
        this.price = price;
    }
}

export interface Product extends IEntity { }

