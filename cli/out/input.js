"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
require("dotenv").config();
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function prompt(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            if (answer.length === 0) {
                reject("No input");
            }
            else {
                resolve(answer);
            }
        });
    });
}
exports.prompt = prompt;
