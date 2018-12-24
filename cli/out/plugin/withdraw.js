"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Withdraw extends base_1.Plugin {
    constructor() {
        super();
        this.name = "Withdraw";
        this.usage = "To withdraw, please enter an amount, then enter your name";
        this.amount = null;
    }
    input_person(person) {
        if (this.amount == null) {
            console.error(this.usage);
            return base_1.PluginResponse.Continue;
        }
        else {
            console.log(`Withdrawn ${this.amount} from ${person.name}`);
            return base_1.PluginResponse.Done;
        }
    }
}
exports.Withdraw = Withdraw;
