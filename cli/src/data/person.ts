export interface IPerson {
    id: string;
    name: string;
    balance: number;
}

export class Person implements IPerson {
    id: string;
    name: string;
    balance: number;

    constructor() {
        this.id = "";
        this.name = "";
        this.balance = 0;
    }
}
