const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const students = data.students;
const instructors = data.instructors;


async function main(){

    const db = await dbConnection.connectToDb();
    await db.dropDatabase();

    const student1 = await students.addStudent("uday", "sama", "udaysama@gmail.com","udaySAMA1700", "Password", "stuff", "stuff")
    const instructor1 = await instructors.addInstructor("pat", "hill", "pathill@gmail.com", "pathill14", "Password123", "stuff")

    console.log(student1)
    console.log(instructor1)
};

main().catch(console.log);
