import { Express, Request, Response, NextFunction } from "express";
import { get_connection } from "../database";

export function configure(e: Express) {
    e.route("/api/users/")
        .get(get_user_list);
    e.route("/api/user")
        .post(create_user);
    e.route("/api/user/:name")
        .get(get_user_by_name);
}

async function get_user_list(_: Request, res: Response) {
    let client = await get_connection();
    try {
        let result = await client.query("SELECT * FROM \"user\"");
        res.json(result.rows);
    } catch (e) {
        res.status(500).json(e);
    } finally {
        client.release();
    }
}

function create_user(req: Request, res: Response, next: NextFunction) {

}

async function get_user_by_name(req: Request, res: Response, next: NextFunction) {
    let client = await get_connection();
    try {
        let result = await client.query("SELECT * FROM \"user\" where name = $1", [req.params.name]);
        res.json(result.rows[0]);
    } catch (e) {
        res.status(500).json(e);
    } finally {
        client.release();
    }
}
