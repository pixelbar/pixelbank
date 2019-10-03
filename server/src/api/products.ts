import { Express, Request, Response } from "express";
import { DI } from "../database";

export function configure(e: Express) {
    e.route("/api/products/")
        .get(get_product_list);
    e.route("/api/product/:code")
        .get(get_product_by_code);
}

async function get_product_list(_: Request, res: Response) {
    const products = await DI.productRepository.findAll();
    res.json(products);
}

async function get_product_by_code(req: Request, res: Response) {
    const product = await DI.productRepository.findOne({ code: req.params.code });
    res.json(product);
}
