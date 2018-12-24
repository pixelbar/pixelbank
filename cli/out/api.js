"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rp = require("request-promise-native");
class Api {
    async get_product_by_id(id) {
        if (id.indexOf("/") != -1 || id.indexOf("\\") != -1) {
            return null;
        }
        let result = await rp.get(process.env.PIXELBANK_SERVER + "/api/product/" + id);
        return parse_json(result);
    }
    async get_user_by_name(name) {
        if (name.indexOf("/") != -1 || name.indexOf("\\") != -1) {
            return null;
        }
        let result = await rp.get(process.env.PIXELBANK_SERVER + "/api/user/" + name);
        return parse_json(result);
    }
}
function parse_json(v) {
    if (v.length == 0) {
        return null;
    }
    else {
        return JSON.parse(v);
    }
}
exports.api = new Api();
