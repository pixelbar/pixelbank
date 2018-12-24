import * as express from "express";
import { configure as database_configure } from "./database";
import { configure as api_users_configure } from "./api/users";
import { configure as api_products_configure } from "./api/products";

if (process.argv[2] == "--configure") {
    database_configure()
        .then(() => {
            console.log("Database configured");
            process.exit(0);
        })
        .catch(e => {
            console.error(e);
            process.exit(1);
        });
} else {
    // Create an express instance
    const app = express();
    api_users_configure(app);
    api_products_configure(app);
    app.listen(2345);
}
