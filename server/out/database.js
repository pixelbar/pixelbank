"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const pg_1 = require("pg");
const colors = require("colors/safe");
const fs_1 = require("fs");
dotenv_1.config();
if (!process.env.DATABASE_URL) {
    console.log(colors.red("Could not start server"));
    console.log(colors.red("Missing .env variable DATABASE_URL"));
    process.exit(-1);
}
// Make sure a connection pool is created
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL
});
/// Get a connection from the postgres pool
function get_connection() {
    return pool.connect();
}
exports.get_connection = get_connection;
async function configure() {
    let client = await get_connection();
    await client.query("BEGIN");
    try {
        await configure_within_transaction(client);
        await client.query("COMMIT");
    }
    catch (e) {
        await client.query("ROLLBACK");
        throw e;
    }
    finally {
        client.release();
    }
}
exports.configure = configure;
async function configure_within_transaction(client) {
    if (!await table_exists(client, "user")) {
        await create_table(client, "user", {
            id: "UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4())",
            name: "TEXT NOT NULL UNIQUE",
            balance: "DECIMAL NOT NULL DEFAULT(0)"
        });
    }
    if (!await table_exists(client, "product")) {
        await create_table(client, "product", {
            id: "UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4())",
            code: "TEXT NOT NULL UNIQUE",
            name: "TEXT NOT NULL",
            description: "TEXT NULL",
            price: "DECIMAL NOT NULL",
            stock: "INT",
        });
    }
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
        await client.query("INSERT INTO product (code, price, name) VALUES ($1, $2, $3)", parts);
    }
}
async function table_exists(client, table) {
    let result = await client.query("SELECT * FROM information_schema.tables WHERE table_name = $1", [table]);
    return result.rows.length > 0;
}
async function create_table_column_if_not_exists(client, table, column_name, column_description) {
    if (!await table_column_exists(client, table, column_name)) {
        await client.query(`ALTER TABLE "${table}" ADD COLUMN "${column_name}" ${column_description}`);
    }
}
async function table_column_exists(client, table, column_name) {
    let result = await client.query("SELECT * FROM information_schema.columns WHERE table_name = $1 AND column_name = $2", [table, column_name]);
    return result.rows.length > 0;
}
async function create_table(client, name, columns) {
    var query = `CREATE TABLE "${name}" (\n`;
    var is_first_column = true;
    for (var name in columns) {
        if (is_first_column)
            is_first_column = false;
        else
            query += ",\n";
        var column_description = columns[name];
        query += `\t"${name}" ${column_description}`;
    }
    query += "\n)";
    console.log(query);
    await client.query(query);
}
