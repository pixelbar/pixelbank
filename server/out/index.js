"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const database_1 = require("./database");
const users_1 = require("./api/users");
const products_1 = require("./api/products");
if (process.argv[2] == "--configure") {
    database_1.configure()
        .then(() => {
        console.log("Database configured");
        process.exit(0);
    })
        .catch(e => {
        console.error(e);
        process.exit(1);
    });
}
else {
    // Create an express instance
    const app = express();
    users_1.configure(app);
    products_1.configure(app);
    app.listen(2345);
}
