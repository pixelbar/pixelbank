"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = require("./plugin");
class State {
    constructor() {
        this.current_plugin = null;
    }
    input_person(person) {
        if (this.current_plugin) {
            this.handle_plugin_result(this.current_plugin.input_person(person));
        }
        else {
            this.print_person_info(person);
        }
    }
    input_product(product) {
        if (!this.current_plugin) {
            this.current_plugin = new plugin_1.Purchase();
        }
        this.handle_plugin_result(this.current_plugin.input_product(product));
    }
    input_amount(amount) {
        if (!this.current_plugin) {
            this.current_plugin = new plugin_1.Withdraw();
        }
        this.handle_plugin_result(this.current_plugin.input_amount(amount));
    }
    handle_plugin_result(result) {
        switch (result) {
            case plugin_1.PluginResponse.Abort:
                this.current_plugin = null;
                break;
            case plugin_1.PluginResponse.Continue:
                break;
            case plugin_1.PluginResponse.Done:
                this.current_plugin = null;
                break;
        }
    }
    print_person_info(person) {
        console.log(`== ${person.name} ==`);
        console.log(`Current balance: ${person.balance}`);
    }
}
exports.state = new State();
