import { Plugin, PluginResponse, Person, Product } from './base'

export class Purchase extends Plugin {
  name: string
  usage: string

  products: Product[]

  constructor() {
    super()
    this.name = 'Withdraw'
    this.usage = 'To withdraw, please enter an amount, then enter your name'

    this.products = []
  }

  inputPerson(person: Person): PluginResponse {
    console.log(`Person ${person.name} is buying:`)
    for (const product of this.products) {
      console.log(product)
    }
    return PluginResponse.Done
  }

  inputProduct(product: Product): PluginResponse {
    this.products.push(product)
    this.printSummary()
    return PluginResponse.Continue
  }

  printSummary(): void {
    const longestName = this.products.reduce((maxLength, product) => Math.max(product.name.length, maxLength), 0) + 5
    for (const product of this.products) {
      console.log(product.name.padEnd(longestName) + ' \u20AC ' + product.price.toFixed(2))
    }
  }
}
