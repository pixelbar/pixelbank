import { Person, Product } from '../data';

export { Person, Product };

export enum PluginResponse {
	Abort,
	Continue,
	Done,
}

export abstract class Plugin {
	abstract name: string;
	abstract usage: string;

	start(): PluginResponse {
		return PluginResponse.Continue;
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	inputPerson(person: Person): PluginResponse {
		console.error(this.usage);
		return PluginResponse.Continue;
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	inputProduct(product: Product): PluginResponse {
		console.error(this.usage);
		return PluginResponse.Continue;
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	inputAmount(amount: number): PluginResponse {
		console.error(this.usage);
		return PluginResponse.Continue;
	}
}
