import { Express, Request, Response } from "express";
import { extract_request_object as request_body_contains_fields } from "../utils";
import { DI } from "../database";
import { User } from "../models/user";

export function configure(e: Express) {
    e.route("/api/users/")
        .get(get_user_list);
    e.route("/api/user")
        .post(create_user);
    e.route("/api/user/:name")
        .get(get_user_by_name);
}

async function get_user_list(req: Request, res: Response) {
    const users = await DI.userRepository.findAll();
    res.json(users);
}

async function create_user(req: Request, res: Response) {
    if (!request_body_contains_fields(req, res, ["name"])) return;
    const user = new User(req.body.name);
    await DI.userRepository.persistAndFlush(user);

    res.json({ success: true, user });
}

async function get_user_by_name(req: Request, res: Response) {
    const name = req.params.name;
    if (!name) return res.json({ success: false, message: "Missing parameter 'name'" });
    const user = await DI.userRepository.findOne({ name: name });
    return res.json({ success: user != null, user });
}
