"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extract_request_object(req, res, fields) {
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
}
exports.extract_request_object = extract_request_object;
;
