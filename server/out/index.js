"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const database_1 = require("./database");
const users_1 = require("./api/users");
const products_1 = require("./api/products");
const app = express();
console.log("Configuring database...");
database_1.configure(app).then(() => {
    if (process.argv.some(a => a == "--seed")) {
        console.log("Seeding database");
        database_1.seed().then(() => {
            console.log("Database is seeded");
            process.exit(0);
        }).catch(e => {
            console.error("Could not seed database");
            console.error(e);
            process.exit(1);
        });
        return;
    }
    console.log("Configuring web api...");
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    users_1.configure(app);
    products_1.configure(app);
    app.listen(2345);
    console.log("Server listening on localhost:2345");
});
