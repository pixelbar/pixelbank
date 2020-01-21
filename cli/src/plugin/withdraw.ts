import { Plugin, PluginResponse, Person } from './base'

export class Withdraw extends Plugin {
  name: string
  usage: string

  amount: number | null

  constructor() {
    super()
    this.name = 'Withdraw'
    this.usage = 'To withdraw, please enter an amount, then enter your name'

    this.amount = null
  }

  inputPerson(person: Person): PluginResponse {
    if (this.amount == null) {
      console.error(this.usage)
      return PluginResponse.Continue
    } else {
      console.log(`Withdrawn ${this.amount} from ${person.name}`)
      return PluginResponse.Done
    }
  }
}
