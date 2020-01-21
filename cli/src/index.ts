import { prompt } from './input'
import * as colors from 'colors/safe'
import { api } from './api'
import { state } from './state'

async function handleInput(input: string): Promise<void> {
  const product = await api.getProductById(input)
  if (product) {
    state.inputProduct(product)
    return
  }

  const user = await api.getUserByName(input)
  if (user) {
    state.inputPerson(user)
    return
  }

  const decimal = parseFloat(input)
  if (!isNaN(decimal)) {
    if (decimal < 1000 && decimal > -1000) {
      state.inputAmount(decimal)
    } else {
      console.log('Error; amount too large and not a valid product code')
    }
  }

  console.log('Error; Unknown command')
}

function promptInput(): void {
  prompt('Product ID, amount or command: ')
    .then(async input => {
      await handleInput(input)
      promptInput()
    })
    .catch(e => {
      console.log(colors.red(e))
      promptInput()
    })
}

promptInput()
