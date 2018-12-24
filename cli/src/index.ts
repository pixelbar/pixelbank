import { prompt } from "./input";
import * as colors from "colors/safe";
import { api } from "./api";
import { state } from "./state";

function prompt_input() {
    prompt("Product ID, amount or command: ").then(async input => {
        await handle_input(input);
        prompt_input();
    }).catch(e => {
        console.log(colors.red(e));
        prompt_input();
    })
}

async function handle_input(input: string) {
    var product = await api.get_product_by_id(input);
    if (product) {
        state.input_product(product);
        return;
    }

    var user = await api.get_user_by_name(input);
    if (user) {
        state.input_person(user);
        return;
    }

    var decimal = parseFloat(input);
    if (!isNaN(decimal)) {
        if (decimal < 1000 && decimal > -1000) {
            state.input_amount(decimal);
        } else {
            console.log("Error; amount too large and not a valid product code");
        }
    }

    console.log("Error; Unknown command");
}

prompt_input();