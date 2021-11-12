const mongoCollections = require('../config/mongoCollections');
const students = mongoCollections.students;

let exportedMethods = {
    async addStudent(firstName, lastName, email, password, lessonsViewed, quizzesCompleted) {
        const studentCollection = await students();

        let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        lessonsViewed: "placeholder",
        quizzesCompleted: "placeholder"
        }

        const newInsertInformation = await studentCollection.insertOne(newUser);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

        return newInsertInformation
    }
};

module.exports = exportedMethods;


