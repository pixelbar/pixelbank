"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const process = require("process");
const Promise = require("promise");
process.stdin.addListener("data", (d) => {
    const line = d.toString().trim();
    console.log("Got", JSON.stringify(line));
});
class PixelBankState {
    get_balance(name) {
        return this.get_balances()
            .then(b => b.find(b => b.name === name));
    }
    set_balance(balance) {
        this.get_balances()
            .then(balances => {
            let found = false;
            for (const b of balances) {
                if (b.name === balance.name) {
                    b.balance = balance.balance;
                    found = true;
                    break;
                }
            }
            if (!found) {
                balances.push(balance);
            }
            return new Promise((resolve, reject) => {
            });
        });
    }
    get_balances() {
        return new Promise((resolve, reject) => {
            fs.readFile("balance.txt", { encoding: "utf8" }, (err, data) => {
                if (err)
                    return reject(err);
                const lines = data.split("\n");
                const balances = [];
                for (const line in lines) {
                    const split = line.split("\t");
                    if (split.length >= 2) {
                        const balance = parseFloat(split[1]);
                        if (!isNaN(balance)) {
                            balances.push(new UserBalance(split[0], balance));
                        }
                    }
                }
                resolve(balances);
            });
        });
    }
}
class UserBalance {
    constructor(name, balance) {
        this.name = name;
        this.balance = balance;
    }
}
