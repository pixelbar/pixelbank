import { Person, Product } from "../data";

export { Person, Product };

export enum PluginResponse {
    Abort,
    Continue,
    Done
}

export abstract class Plugin {
    abstract name: string;
    abstract usage: string;

    start(): PluginResponse {
        return PluginResponse.Continue;
    }
    input_person(person: Person): PluginResponse {
        console.error(this.usage);
        return PluginResponse.Continue;
    }
    input_product(product: Product): PluginResponse {
        console.error(this.usage);
        return PluginResponse.Continue;
    }
    input_amount(amount: number): PluginResponse {
        console.error(this.usage);
        return PluginResponse.Continue;
    }
}
