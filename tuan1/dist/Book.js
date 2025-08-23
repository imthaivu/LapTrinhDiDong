"use strict";
//Create a class Book with attributes title, author, year
class Book {
    constructor(title, author, year) {
        this.title = title;
        this.author = author;
        this.year = year;
    }
    displayInfo() {
        console.log(`title: ${this.title}, author: ${this.author}, year: ${this.year}`);
    }
}
const book = new Book("sach 1", "tg 1", 2020);
book.displayInfo();
