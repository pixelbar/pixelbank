import { Entity, PrimaryKey, Property } from "mikro-orm";
import uuid from "uuid/v4";

@Entity()
export class User {
    @PrimaryKey()
    id: string;

    @Property()
    name: string;

    @Property()
    balance: number;

    constructor(name: string) {
        this.id = uuid();
        this.name = name;
    }
}

export interface User { }

