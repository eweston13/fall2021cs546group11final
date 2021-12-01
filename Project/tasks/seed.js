const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const students = data.students;
const instructors = data.instructors;
const lessons = data.lessons;


async function main(){

    const db = await dbConnection.connectToDb();
    await db.dropDatabase();

    const student1 = await students.addStudent("uday", "sama", "udaysama@gmail.com","udaySAMA1700", "Password");
    const instructor1 = await instructors.addInstructor("pat", "hill", "pathill@gmail.com", "pathill14", "Password123");
    const instructor2 = await instructors.addInstructor("Erin", "Weston", "eweston@stevens.edu", "gearboxer", "testpassword1234");
    
    const testLesson = await lessons.createLesson('test lesson', instructor2, 'This is a CAD lesson (I swear)', ['Autodesk Inventor 2022']);
    
    console.log('Done seeding!'); // this line is in here because encrypting the passwords takes a while and the site won't work until it's done
};

module.exports = main;
