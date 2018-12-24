"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
function configure(e) {
    e.route("/api/users/")
        .get(get_user_list);
    e.route("/api/user")
        .post(create_user);
    e.route("/api/user/:name")
        .get(get_user_by_name);
}
exports.configure = configure;
async function get_user_list(_, res) {
    let client = await database_1.get_connection();
    try {
        let result = await client.query("SELECT * FROM \"user\"");
        res.json(result.rows);
    }
    catch (e) {
        res.status(500).json(e);
    }
    finally {
        client.release();
    }
}
function create_user(req, res, next) {
}
async function get_user_by_name(req, res, next) {
    let client = await database_1.get_connection();
    try {
        let result = await client.query("SELECT * FROM \"user\" where name = $1", [req.params.name]);
        res.json(result.rows[0]);
    }
    catch (e) {
        res.status(500).json(e);
    }
    finally {
        client.release();
    }
}
