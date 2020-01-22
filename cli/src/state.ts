import { Plugin, PluginResponse, Person, Product, Purchase, Withdraw } from './plugin';

class State {
	currentPlugin: Plugin | null;

	constructor() {
		this.currentPlugin = null;
	}

	inputPerson(person: Person): void {
		if (this.currentPlugin) {
			this.handlePluginResult(this.currentPlugin.inputPerson(person));
		} else {
			this.printPersonInfo(person);
		}
	}

	inputProduct(product: Product): void {
		if (!this.currentPlugin) {
			this.currentPlugin = new Purchase();
		}
		this.handlePluginResult(this.currentPlugin.inputProduct(product));
	}

	inputAmount(amount: number): void {
		if (!this.currentPlugin) {
			this.currentPlugin = new Withdraw();
		}
		this.handlePluginResult(this.currentPlugin.inputAmount(amount));
	}

	handlePluginResult(result: PluginResponse): void {
		switch (result) {
			case PluginResponse.Abort:
				this.currentPlugin = null;
				break;
			case PluginResponse.Continue:
				break;
			case PluginResponse.Done:
				this.currentPlugin = null;
				break;
		}
	}

	printPersonInfo(person: Person): void {
		console.log(`== ${person.name} ==`);
		console.log(`Current balance: ${person.balance}`);
	}
}

export const state = new State();
