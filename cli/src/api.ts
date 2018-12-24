import { IProduct, IPerson } from "./data";
import * as rp from "request-promise-native";

class Api {
    async get_product_by_id(id: string): Promise<IProduct | null> {
        if (id.indexOf("/") != -1 || id.indexOf("\\") != -1) {
            return null;
        }
        let result = await rp.get(process.env.PIXELBANK_SERVER + "/api/product/" + id)
        return parse_json(result);
    }

    async get_user_by_name(name: string): Promise<IPerson | null> {
        if (name.indexOf("/") != -1 || name.indexOf("\\") != -1) {
            return null;
        }
        let result = await rp.get(process.env.PIXELBANK_SERVER + "/api/user/" + name);
        return parse_json(result);
    }
}

function parse_json<T>(v: string): T | null {
    if (v.length == 0) {
        return null;
    } else {
        return JSON.parse(v);
    }

}

export const api = new Api();
