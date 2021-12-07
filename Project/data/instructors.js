const mongoCollections = require('../config/mongoCollections');
const instructors = mongoCollections.instructors;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const ObjectId = require('mongodb').ObjectId;

async function addInstructor(firstName, lastName, email, username, password) {
    if (!username || !password) throw 'Username and password both must be supplied';
    if (username == ''.repeat(username.length)) throw 'Username cannot be only spaces';
    if (username.length < 4) throw 'Username must be at least 4 letters long';
    if (/^[a-zA-Z0-9]*$/.test(username) == false) throw 'Username should be alphanumeric';

    if (password.length < 6) throw 'Password must be at least 6 letters long';
    if (password.includes(' ')) throw 'Password cannot contain a space';

    const instructorCollection = await instructors();

    let userExists = await instructorCollection.findOne({ username: username });
    if (userExists) throw 'Username already exists in system';

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username.toLowerCase(),
        password: await bcrypt.hash(password, saltRounds),
        lessonsCreated: [],
    };

    const newInsertInformation = await instructorCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

    const newId = newInsertInformation.insertedId.toString();
    return newId;
}

async function getInstructorById(id) {
    const instructorCollection = await instructors();
    const instructor = await instructorCollection.findOne({_id : id})
    if (!instructor) throw 'Instructor not found'
    return instructor
}

async function deleteInstructor(id){
    const instructorCollection = await instructors();
    const deletionInfo = await instructorCollection.removeOne({_id: id});
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete user with the id of "${id}"`
    }
    return true;
}

async function updateInstructor(id, updatedInstructor){
    if (!updatedInstructor.username || !updatedInstructor.password) throw 'Username and password both must be supplied';
    if (updatedInstructor.username == ''.repeat(updatedInstructor.username.length)) throw 'Username cannot be only spaces';
    if (updatedInstructor.username.length < 4) throw 'Username must be at least 4 letters long';
    if (/^[a-zA-Z0-9]*$/.test(updatedInstructor.username) == false) throw 'Username should be alphanumeric';

    const instructorCollection = await instructors();

    let userExists = await instructorCollection.findOne({ username: updatedInstructor.username });
    if (userExists) throw 'Username already exists in system';

    if (updatedInstructor.password.length < 6) throw 'Password must be at least 6 letters long';
    if (updatedInstructor.password.includes(' ')) throw 'Password cannot contain a space';


    let instructorUpdateInfo = {
        firstName: updatedInstructor.firstName,
        lastName: updatedInstructor.lastName,
        email: updatedInstructor.email,
        username: updatedInstructor.username,
        password: updatedInstructor.password
    }
    const updateInfo = await instructorCollection.updateOne(
        { _id: id },
        { $set: userUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
        throw 'Update failed';
    }

    const newId = updateInfo.insertedId.toString();
    return await this.getInstructorById(newId)
}

async function checkInstructor(username, pass) {
    //    console.log("pass: ", pass)
    if (!username || !pass) throw 'Username and password both must be supplied';
    if (username == ''.repeat(username.length)) throw 'Username cannot be only spaces';
    if (username.length < 4) throw 'Username must be at least 4 letters long';
    if (/^[a-zA-Z0-9]*$/.test(username) == false) throw 'Username should be alphanumeric';
    if (pass < 6) throw 'Password must be at least 6 letters long';
    if (pass.includes(' ')) throw 'Password cannot contain a space';

    const instructorCollection = await instructors();
    username = username.toLowerCase();
    let obj = await instructorCollection.findOne({ username: username });

    var passCheck;
    try {
        passCheck = await bcrypt.compare(pass, obj.password);
    } catch (e) {
        throw 'Either the username or password is invalid';
    }

    if (passCheck && username == obj.username) {
        return { authenticated: true };
    }

    throw 'Either the username or password is invalid';
}

//function test is used just to test individual functions to see if they work, seed file must be run first
// async function test(){
//     let instructor1verif = await checkInstructor("pathill14", "Password123")
//     console.log("Instructor check:", instructor1verif)
// }

//test()
async function test() {
    let instructor1verif = await checkInstructor('pathill14', 'Password123');
    console.log('Instructor check:', instructor1verif);
}

async function getInstructorName(id) {
    // this is to get the username of instructors to display on lesson views
    const instructorCollection = await instructors();

    const convertedId = ObjectId(id);
    const instructor = await instructorCollection.findOne({ _id: convertedId });

    if (instructor === null) return 'Deleted User';
    return instructor.username;
}

module.exports = {
    addInstructor,
    checkInstructor,
    getInstructorName,
    getInstructorById,
    deleteInstructor,
    updateInstructor
};
