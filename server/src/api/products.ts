import { Express, Request, Response } from 'express'
import { DI } from '../database'

async function getProductList(_: Request, res: Response): Promise<void> {
  const products = await DI.productRepository.findAll()
  res.json(products)
}

async function getProductByCode(req: Request, res: Response): Promise<void> {
  const product = await DI.productRepository.findOne({ code: req.params.code })
  res.json(product)
}

export function configure(e: Express): void {
  e.route('/api/products/').get(getProductList)
  e.route('/api/product/:code').get(getProductByCode)
}
