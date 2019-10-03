"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const database_1 = require("../database");
const user_1 = require("../models/user");
function configure(e) {
    e.route("/api/users/")
        .get(get_user_list);
    e.route("/api/user")
        .post(create_user);
    e.route("/api/user/:name")
        .get(get_user_by_name);
}
exports.configure = configure;
async function get_user_list(req, res) {
    const users = await database_1.DI.userRepository.findAll();
    res.json(users);
}
async function create_user(req, res) {
    if (!utils_1.extract_request_object(req, res, ["name"]))
        return;
    const user = new user_1.User(req.body.name);
    await database_1.DI.userRepository.persistAndFlush(user);
    res.json({ success: true, user });
}
async function get_user_by_name(req, res) {
    const name = req.params.name;
    if (!name)
        return res.json({ success: false, message: "Missing parameter 'name'" });
    const user = await database_1.DI.userRepository.findOne({ name: name });
    return res.json({ success: !!user, user });
}
