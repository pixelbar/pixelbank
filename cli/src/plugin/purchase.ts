import { Plugin, PluginResponse, Person, Product } from "./base";

export class Purchase extends Plugin {
    name: string;
    usage: string;

    products: Product[];

    constructor() {
        super();
        this.name = "Withdraw";
        this.usage = "To withdraw, please enter an amount, then enter your name";

        this.products = [];
    }

    input_person(person: Person): PluginResponse {
        console.log(`Person ${person.name} is buying:`);
        for (const product of this.products) {
            console.log(product);
        }
        return PluginResponse.Done;
    }

    input_product(product: Product): PluginResponse {
        this.products.push(product);
        this.print_summary();
        return PluginResponse.Continue;
    }

    print_summary() {
        const longest_name = this.products
            .reduce((max_length, product) => Math.max(product.name.length, max_length), 0)
            + 5;
        for (const product of this.products) {
            console.log(product.name.padEnd(longest_name) + " \u20AC " + product.price);
        }
    }
}
