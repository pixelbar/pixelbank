import { Person, Product } from '../data'

export { Person, Product }

export enum PluginResponse {
  Abort,
  Continue,
  Done,
}

export abstract class Plugin {
  abstract name: string
  abstract usage: string

  start(): PluginResponse {
    return PluginResponse.Continue
  }
  inputPerson(person: Person): PluginResponse {
    console.error(this.usage)
    return PluginResponse.Continue
  }
  inputProduct(product: Product): PluginResponse {
    console.error(this.usage)
    return PluginResponse.Continue
  }
  inputAmount(amount: number): PluginResponse {
    console.error(this.usage)
    return PluginResponse.Continue
  }
}
