import { Person } from './Person';
class Student extends Person {
    grade: string;

    constructor(name: string, age: number, grade: string) {
        super(name, age);
        this.grade = grade;
    }

    displayInfo(): void {
        console.log(`Name: ${this.name}, Age: ${this.age}, Grade: ${this.grade}`);
    }
}
function main() {
    const student = new Student("Jane Doe", 20, "A");
    student.displayInfo();
}

main();
