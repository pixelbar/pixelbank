import { Plugin, PluginResponse, Person, Product, Purchase, Withdraw } from "./plugin";

class State {
    current_plugin: Plugin | null;

    constructor() {
        this.current_plugin = null;
    }

    input_person(person: Person) {
        if (this.current_plugin) {
            this.handle_plugin_result(this.current_plugin.input_person(person));
        } else {
            this.print_person_info(person);
        }
    }

    input_product(product: Product) {
        if (!this.current_plugin) {
            this.current_plugin = new Purchase();
        }
        this.handle_plugin_result(this.current_plugin.input_product(product));
    }

    input_amount(amount: number) {
        if (!this.current_plugin) {
            this.current_plugin = new Withdraw();
        }
        this.handle_plugin_result(this.current_plugin.input_amount(amount));
    }

    handle_plugin_result(result: PluginResponse) {
        switch (result) {
            case PluginResponse.Abort:
                this.current_plugin = null;
                break;
            case PluginResponse.Continue:
                break;
            case PluginResponse.Done:
                this.current_plugin = null;
                break;
        }
    }

    print_person_info(person: Person) {
        console.log(`== ${person.name} ==`);
        console.log(`Current balance: ${person.balance}`);
    }
}

export const state = new State();