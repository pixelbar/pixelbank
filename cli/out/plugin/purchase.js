"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Purchase extends base_1.Plugin {
    constructor() {
        super();
        this.name = "Withdraw";
        this.usage = "To withdraw, please enter an amount, then enter your name";
        this.products = [];
    }
    input_person(person) {
        console.log(`Person ${person.name} is buying:`);
        for (const product of this.products) {
            console.log(product);
        }
        return base_1.PluginResponse.Done;
    }
    input_product(product) {
        this.products.push(product);
        this.print_summary();
        return base_1.PluginResponse.Continue;
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
exports.Purchase = Purchase;
