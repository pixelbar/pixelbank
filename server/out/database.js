"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mikro_orm_1 = require("mikro-orm");
const dotenv_1 = require("dotenv");
const user_1 = require("./models/user");
const product_1 = require("./models/product");
const fs_1 = require("fs");
async function configure(app) {
    dotenv_1.config();
    if (!process.env.DATABASE_URL) {
        console.log("Could not start server");
        console.log("Missing .env variable DATABASE_URL");
        process.exit(-1);
    }
    const orm = await mikro_orm_1.MikroORM.init({
        entitiesDirs: ['./models'],
        entitiesDirsTs: ['../src/models'],
        dbName: 'pixelbank',
        type: 'postgresql',
        clientUrl: process.env.DATABASE_URL,
        baseDir: __dirname,
        autoFlush: false,
    });
    exports.DI.orm = orm;
    exports.DI.em = exports.DI.orm.em;
    configureDIRepositories();
    // configure each express request to have a unique instance of MikroORM
    app.use((req, res, next) => {
        mikro_orm_1.RequestContext.create(exports.DI.orm.em, next);
    });
}
exports.configure = configure;
async function seed() {
    const file = await new Promise((res, rej) => {
        fs_1.readFile("products.txt", { encoding: "UTF8" }, (err, data) => {
            if (err)
                rej(err);
            else
                res(data.toString());
        });
    });
    for (let line of file.split("\n")) {
        line = line.trim();
        if (line.length == 0 || line.startsWith("#"))
            continue;
        let parts = line.split(/(  |\t)/).map(v => v.trim()).filter(v => !!v);
        console.log(parts);
        if (parts.length != 3) {
            console.error("Could not insert");
            continue;
        }
        let code = parts[0];
        let price = parseFloat(parts[1]);
        let name = parts[2];
        console.log(JSON.stringify({ code, price, name }));
        await exports.DI.productRepository.persist(new product_1.Product(code, name, price));
    }
    await exports.DI.productRepository.flush();
}
exports.seed = seed;
exports.DI = {};
function configureDIRepositories() {
    exports.DI.userRepository = exports.DI.orm.em.getRepository(user_1.User);
    exports.DI.productRepository = exports.DI.orm.em.getRepository(product_1.Product);
}
