"use strict";
class BankAccount {
    constructor(initialBalance) {
        this.balance = initialBalance;
    }
    deposit(amount) {
        this.balance += amount;
    }
    withdraw(amount) {
        this.balance -= amount;
    }
    getBalance() {
        return this.balance;
    }
}
function main() {
    const account = new BankAccount(1000);
    account.deposit(500);
    account.withdraw(200);
    console.log(account.getBalance());
}
main();
