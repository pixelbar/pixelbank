"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
function configure(e) {
    e.route("/api/products/")
        .get(get_product_list);
    e.route("/api/product")
        .post(create_product);
    e.route("/api/product/:code")
        .get(get_product_by_code);
}
exports.configure = configure;
async function get_product_list(_, res) {
    let client = await database_1.get_connection();
    try {
        let result = await client.query("SELECT * FROM product");
        res.json(result.rows);
    }
    catch (e) {
        res.status(500).json(e);
    }
    finally {
        client.release();
    }
}
function create_product(req, res, next) {
}
async function get_product_by_code(req, res, next) {
    let client = await database_1.get_connection();
    try {
        let result = await client.query("SELECT * FROM product where code = $1", [req.params.code]);
        res.json(result.rows[0]);
    }
    catch (e) {
        res.status(500).json(e);
    }
    finally {
        client.release();
    }
}
