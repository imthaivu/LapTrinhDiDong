
class BankAccount {
    private balance: number;

    constructor(initialBalance: number) {
        this.balance = initialBalance;
    }

    deposit(amount: number): void {
        this.balance += amount;
    }

    withdraw(amount: number): void {
        this.balance -= amount;
    }

    getBalance(): number {
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
