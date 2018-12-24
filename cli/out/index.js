"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("./input");
const colors = require("colors/safe");
const api_1 = require("./api");
const state_1 = require("./state");
function prompt_input() {
    input_1.prompt("Product ID, amount or command: ").then(async (input) => {
        await handle_input(input);
        prompt_input();
    }).catch(e => {
        console.log(colors.red(e));
        prompt_input();
    });
}
async function handle_input(input) {
    var product = await api_1.api.get_product_by_id(input);
    if (product) {
        state_1.state.input_product(product);
        return;
    }
    var user = await api_1.api.get_user_by_name(input);
    if (user) {
        state_1.state.input_person(user);
        return;
    }
    var decimal = parseFloat(input);
    if (!isNaN(decimal)) {
        if (decimal < 1000 && decimal > -1000) {
            state_1.state.input_amount(decimal);
        }
        else {
            console.log("Error; amount too large and not a valid product code");
        }
    }
    console.log("Error; Unknown command");
}
prompt_input();
