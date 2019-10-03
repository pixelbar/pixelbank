"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
function configure(e) {
    e.route("/api/products/")
        .get(get_product_list);
    e.route("/api/product/:code")
        .get(get_product_by_code);
}
exports.configure = configure;
async function get_product_list(_, res) {
    const products = await database_1.DI.productRepository.findAll();
    res.json(products);
}
async function get_product_by_code(req, res) {
    const product = await database_1.DI.productRepository.findOne({ code: req.params.code });
    res.json(product);
}
