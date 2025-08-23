
class Rectangle {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    calculateArea(): number {
        return this.width * this.height;
    }

    calculatePerimeter(): number {
        return 2 * (this.width + this.height);
    }
}

function main() {
    const rectangle = new Rectangle(5, 10);
    console.log(`Area: ${rectangle.calculateArea()}`);
    console.log(`Perimeter: ${rectangle.calculatePerimeter()}`);
}

main();
