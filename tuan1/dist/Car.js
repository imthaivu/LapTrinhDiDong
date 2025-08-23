"use strict";
class Car {
    constructor(brand, model, year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    displayInfo() {
        console.log(`Brand: ${this.brand}, Mdel: ${this.model}, year: ${this.year}`);
    }
}
