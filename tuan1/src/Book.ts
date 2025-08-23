//Create a class Book with attributes title, author, year
class Book {
    title: string;
    author: string;
    year: number;

    constructor(title: string, author: string, year: number) {
        this.title = title;
        this.author = author;
        this.year = year;
    }

    displayInfo(): void {
        console.log(`title: ${this.title}, author: ${this.author}, year: ${this.year}`);
    }
}

const book = new Book("sach 1", "tg 1", 2020);
book.displayInfo();