import { Request, Response } from "express";

function extract_request_object(req: Request, res: Response, fields: [string]) {
    if (typeof (req.body) != "object" || req.body === null || req.body === undefined) {
        res.json({ success: false, message: "Missing JSON body" });
        return false;
    }
    for (const field of fields) {
        if (!req.body.hasOwnProperty(field)) {
            res.json({ success: false, message: "Missing one or multiple fields", fields });
            return false;
        }
    }
    return true;
};

export {
    extract_request_object
};