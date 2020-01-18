import { MikroORM, RequestContext, EntityManager, EntityRepository, Options as MikroOptions } from "mikro-orm";
import { config as dotenv_config } from "dotenv";
import { Express } from "express";
import { User } from "./models/user";
import { Product } from "./models/product";
import { Payment } from "./models/payment";
import { readFile, unlink } from "fs";

export async function configure(app: Express) {
    dotenv_config();

    let config: MikroOptions;
    let force_reseed = false;
    if (!process.env.DATABASE_URL) {
        console.log("Missing .env variable DATABASE_URL");
        console.log("Will use a temporary sqlite database. This should not be used in production");

        await new Promise((res) => unlink("pixelbank.sqlite", res));

        config = {
            entitiesDirs: ['./models'],
            entitiesDirsTs: ['../src/models'],
            baseDir: __dirname,
            autoFlush: false,
            type: 'sqlite',
            dbName: 'pixelbank.sqlite'
        };
        force_reseed = true;
    } else {
        config = {
            entitiesDirs: ['./models'],
            entitiesDirsTs: ['../src/models'],
            baseDir: __dirname,
            autoFlush: false,
            dbName: 'pixelbank',
            type: 'postgresql',
            clientUrl: process.env.DATABASE_URL,
        };
    }

    const orm = await MikroORM.init(config);

    DI.orm = orm;
    DI.em = DI.orm.em;
    configureDIRepositories();

    // configure each express request to have a unique instance of MikroORM
    app.use((req, res, next) => {
        RequestContext.create(DI.orm.em, next);
    });

    if (force_reseed) {
        await seed();
    }
}

export async function seed() {
    const generator = DI.orm.getSchemaGenerator();
    console.log("Updating schema...");
    await generator.updateSchema();

    console.log("Filling products...");

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

        await DI.productRepository.persist(new Product(code, name, price));
    }
    await DI.productRepository.flush();
}

export const DI = {} as {
    orm: MikroORM,
    em: EntityManager,
    userRepository: EntityRepository<User>,
    productRepository: EntityRepository<Product>,
    paymentRepository: EntityRepository<Payment>,
};

function configureDIRepositories() {
    DI.userRepository = DI.orm.em.getRepository(User);
    DI.productRepository = DI.orm.em.getRepository(Product);
    DI.paymentRepository = DI.orm.em.getRepository(Payment);
}