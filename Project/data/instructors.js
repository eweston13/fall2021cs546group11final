const mongoCollections = require('../config/mongoCollections');
const instructors = mongoCollections.instructors;

let exportedMethods = {
    async addInstructor(firstName, lastName, email, password, lessonsCreated) {
        const instructorCollection = await instructors();

        let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        lessonsCreated: "placeholder",
        }

        const newInsertInformation = await instructorCollection.insertOne(newUser);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

        return newInsertInformation
    }
};

module.exports = exportedMethods;