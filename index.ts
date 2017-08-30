import * as fs from "fs";
import * as process from "process";
import * as Promise from "promise";

process.stdin.addListener("data", (d: Buffer) => {
    const line = d.toString().trim();
    console.log("Got", JSON.stringify(line));
});

class PixelBankState {
    get_balance(name: string): Promise<UserBalance | undefined> {
        return this.get_balances()
                    .then(b => b.find(b => b.name === name))
    }

    set_balance(balance: UserBalance) {
        this.get_balances()
            .then(balances => {
                let found = false;
                for(const b of balances){
                    if(b.name === balance.name){
                        b.balance = balance.balance;
                        found = true;
                        break;
                    }
                }

                if(!found){
                    balances.push(balance);
                }

                return new Promise((resolve, reject) => {

                });
            })
    }

    get_balances(): Promise<UserBalance[]> {
        return new Promise((resolve, reject) => {
            fs.readFile("balance.txt", { encoding: "utf8" }, (err, data) => {
                if(err) return reject(err);
                const lines = data.split("\n");

                const balances = [];

                for(const line in lines) {
                    const split = line.split("\t");
                    if(split.length >= 2){
                        const balance = parseFloat(split[1]);
                        if(!isNaN(balance)){
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
    constructor(public name: string, public balance: number){

    }
}