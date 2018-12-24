"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../data");
exports.Person = data_1.Person;
exports.Product = data_1.Product;
var PluginResponse;
(function (PluginResponse) {
    PluginResponse[PluginResponse["Abort"] = 0] = "Abort";
    PluginResponse[PluginResponse["Continue"] = 1] = "Continue";
    PluginResponse[PluginResponse["Done"] = 2] = "Done";
})(PluginResponse = exports.PluginResponse || (exports.PluginResponse = {}));
class Plugin {
    start() {
        return PluginResponse.Continue;
    }
    input_person(person) {
        console.error(this.usage);
        return PluginResponse.Continue;
    }
    input_product(product) {
        console.error(this.usage);
        return PluginResponse.Continue;
    }
    input_amount(amount) {
        console.error(this.usage);
        return PluginResponse.Continue;
    }
}
exports.Plugin = Plugin;
