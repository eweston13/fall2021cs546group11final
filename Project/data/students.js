const mongoCollections = require('../config/mongoCollections');
const students = mongoCollections.students;
const bcrypt = require('bcrypt');
const saltRounds = 16;

async function addStudent(
    firstName,
    lastName,
    email,
    username,
    password,
    lessonsViewed,
    quizzesCompleted,
) {
    if (!username || !password) throw 'Username and password both must be supplied';
    if (username == ''.repeat(username.length)) throw 'Username cannot be only spaces';
    if (username.length < 4) throw 'Username must be at least 4 letters long';
    if (/^[a-zA-Z0-9]*$/.test(username) == false) throw 'Username should be alphanumeric';

    if (password.length < 6) throw 'Password must be at least 6 letters long';
    if (password.includes(' ')) throw 'Password cannot contain a space';
    const studentCollection = await students();

    let userExists = await studentCollection.findOne({ username: username });
    if (userExists) throw 'Username already exists in system';

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username.toLowerCase(),
        password: await bcrypt.hash(password, saltRounds),
        lessonsViewed: [],
        quizzesCompleted: [],
    };

    //REMEMBER TO MAKE USERNAMES LOWERCASE
    const newInsertInformation = await studentCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

    return { userInserted: true };
}

async function getStudentById(id) {
    const studentCollection = await students();
    const student = await studentCollection.findOne({ _id: id });
    if (!student) throw 'Student not found';
    return student;
}

async function deleteStudent(id) {
    const studentCollection = await students();
    const deletionInfo = await studentCollection.removeOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete user with the id of "${id}"`;
    }
    return true;
}

async function updateStudent(id, updatedStudent) {
    if (!updatedStudent.username || !updatedStudent.password)
        throw 'Username and password both must be supplied';
    if (updatedStudent.username == ''.repeat(updatedStudent.username.length))
        throw 'Username cannot be only spaces';
    if (updatedStudent.username.length < 4) throw 'Username must be at least 4 letters long';
    if (/^[a-zA-Z0-9]*$/.test(updatedStudent.username) == false)
        throw 'Username should be alphanumeric';

    const studentCollection = await students();

    let userExists = await studentCollection.findOne({ username: updatedStudent.username });
    if (userExists) throw 'Username already exists in system';

    if (updatedStudent.password.length < 6) throw 'Password must be at least 6 letters long';
    if (updatedStudent.password.includes(' ')) throw 'Password cannot contain a space';

    let studentUpdateInfo = {
        firstName: updatedStudent.firstName,
        lastName: updatedStudent.lastName,
        email: updatedStudent.email,
        username: updatedStudent.username,
        password: updatedStudent.password,
        lessonsViewed: updatedStudent.lessonsViewed,
        quizzesCompleted: updatedStudent.quizzesCompleted,
    };
    const updateInfo = await studentCollection.updateOne({ _id: id }, { $set: userUpdateInfo });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
        throw 'Update failed';
    }

    const newId = updateInfo.insertedId.toString();
    return await this.getStudentById(newId);
}

async function checkStudent(username, pass) {
    if (!username || !pass) throw 'Username and password both must be supplied';
    if (username == ''.repeat(username.length)) throw 'Username cannot be only spaces';
    if (username.length < 4) throw 'Username must be at least 4 letters long';
    if (/^[a-zA-Z0-9]*$/.test(username) == false) throw 'Username should be alphanumeric';
    if (pass < 6) throw 'Password must be at least 6 letters long';
    if (pass.includes(' ')) throw 'Password cannot contain a space';

    const studentCollection = await students();
    username = username.toLowerCase();
    let obj = await studentCollection.findOne({ username: username });
    return { userInserted: true };
}

async function checkStudent(username, pass) {
    if (!username || !pass) throw 'Username and password both must be supplied';
    if (username == ''.repeat(username.length)) throw 'Username cannot be only spaces';
    if (username.length < 4) throw 'Username must be at least 4 letters long';
    if (/^[a-zA-Z0-9]*$/.test(username) == false) throw 'Username should be alphanumeric';
    if (pass < 6) throw 'Password must be at least 6 letters long';
    if (pass.includes(' ')) throw 'Password cannot contain a space';

    const studentCollection = await students();
    username = username.toLowerCase();
    let obj = await studentCollection.findOne({ username: username });

    var passCheck;
    try {
        passCheck = await bcrypt.compare(pass, obj.password);
    } catch (e) {
        console.log(e);
    }

    if (passCheck && username == obj.username) {
        return { authenticated: true };
    }

    throw 'Either the username or password is invalid';
}

//function test is used just to test individual functions to see if they work, seed file must be run first
async function test() {
    let student1verif = await checkStudent('udaySama17', 'Password');
    console.log('Student check:', student1verif);
}

//test()

module.exports = {
    addStudent,
    checkStudent,
    getStudentById,
    deleteStudent,
    updateStudent,
};
