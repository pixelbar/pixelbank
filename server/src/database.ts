import { MikroORM, RequestContext, EntityManager, EntityRepository } from "mikro-orm";
import { config as dotenv_config } from "dotenv";
import { Express } from "express";
import { User } from "./models/user";
import { Product } from "./models/product";
import { readFile } from "fs";

export async function configure(app: Express) {
    dotenv_config();

    if (!process.env.DATABASE_URL) {
        console.log("Could not start server");
        console.log("Missing .env variable DATABASE_URL");
        process.exit(-1);
    }

    const orm = await MikroORM.init({
        entitiesDirs: ['./models'],
        entitiesDirsTs: ['../src/models'],
        dbName: 'pixelbank',
        type: 'postgresql',
        clientUrl: process.env.DATABASE_URL,
        baseDir: __dirname,
        autoFlush: false,
    });

    DI.orm = orm;
    DI.em = DI.orm.em;
    configureDIRepositories();

    // configure each express request to have a unique instance of MikroORM
    app.use((req, res, next) => {
        RequestContext.create(DI.orm.em, next);
    });
}

export async function seed() {
    const file: string = await new Promise((res, rej) => {
        readFile("products.txt", { encoding: "UTF8" }, (err, data) => {
            if (err) rej(err);
            else res(data.toString());
        })
    });

    for (let line of file.split("\n")) {
        line = line.trim();
        if (line.length == 0 || line.startsWith("#")) continue;
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

        await DI.productRepository.persist(new Product(code, name, price));
    }
    await DI.productRepository.flush();
}

export const DI = {} as {
    orm: MikroORM,
    em: EntityManager,
    userRepository: EntityRepository<User>,
    productRepository: EntityRepository<Product>,
};

function configureDIRepositories() {
    DI.userRepository = DI.orm.em.getRepository(User);
    DI.productRepository = DI.orm.em.getRepository(Product);
}