import { Express, Request, Response, NextFunction } from "express";
import { get_connection } from "../database";

export function configure(e: Express) {
    e.route("/api/products/")
        .get(get_product_list);
    e.route("/api/product")
        .post(create_product);
    e.route("/api/product/:code")
        .get(get_product_by_code);
}

async function get_product_list(_: Request, res: Response) {
    let client = await get_connection();
    try {
        let result = await client.query("SELECT * FROM product");
        res.json(result.rows);
    } catch (e) {
        res.status(500).json(e);
    } finally {
        client.release();
    }
}

function create_product(req: Request, res: Response, next: NextFunction) {

}

async function get_product_by_code(req: Request, res: Response, next: NextFunction) {
    let client = await get_connection();
    try {
        let result = await client.query("SELECT * FROM product where code = $1", [req.params.code]);
        res.json(result.rows[0]);
    } catch (e) {
        res.status(500).json(e);
    } finally {
        client.release();
    }
}
