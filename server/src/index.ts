import * as express from "express";
import * as cors from "cors";
import { configure as database_configure, seed as seed_database } from "./database";
import { configure as api_users_configure } from "./api/users";
import { configure as api_products_configure } from "./api/products";

const app = express();
console.log("Configuring database...");
database_configure(app).then(() => {
    if (process.argv.some(a => a == "--seed")) {
        console.log("Seeding database");
        seed_database().then(() => {
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

    api_users_configure(app);
    api_products_configure(app);
    app.listen(2345);
    console.log("Server listening on localhost:2345");
})