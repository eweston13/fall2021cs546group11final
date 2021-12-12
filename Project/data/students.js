const mongoCollections = require('../config/mongoCollections');
const students = mongoCollections.students;
const lessons = mongoCollections.lessons;
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');
const saltRounds = 16;

async function addStudent(firstName, lastName, email, username, password) {
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
        questionsAsked: []
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
    var convertedId = new ObjectId(id)
    const deletionInfo = await studentCollection.removeOne({ _id: convertedId });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete user with the id of "${id}"`;
    }
    return true;
}

async function updateStudent(id, firstName, lastName, email, username, password) {
    if (!username || !password) throw 'Username and password both must be supplied';
    if (username == ''.repeat(username.length)) throw 'Username cannot be only spaces';
    if (username.length < 4) throw 'Username must be at least 4 letters long';
    if (/^[a-zA-Z0-9]*$/.test(username) == false) throw 'Username should be alphanumeric';

    const studentCollection = await students();

    let userExists = await studentCollection.findOne({ username: username });
    if (userExists) throw 'Username already exists in system';

    if (password.length < 6) throw 'Password must be at least 6 letters long';
    if (password.includes(' ')) throw 'Password cannot contain a space';

    let studentUpdateInfo = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: await bcrypt.hash(password, saltRounds),
    };

    var convertedId = new ObjectId(id)
    const updateInfo = await studentCollection.updateOne({ _id: convertedId }, { $set: studentUpdateInfo });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
        throw 'Update failed';
    }

    return await getStudentById(convertedId);
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
        throw 'Either the username or password is invalid';
    }

    if (passCheck && username == obj.username) {
        return { authenticated: true };
    }

    throw 'Either the username or password is invalid';
}

const addViewedLesson = async (studentId, lessonId) => {
    // validation functions later

    const studentCollection = await students();
    const convertedStudent = new ObjectId(studentId);

    const student = await studentCollection.findOne({ _id: convertedStudent });

    let alreadyAdded = false;
    for (let i = 0; i < student.lessonsViewed.length; i++) {
        if (student.lessonsViewed[i] == lessonId) alreadyAdded = true;
    }
    student.lessonsViewed.unshift(lessonId);
    if (student.lessonsViewed.length == 11) student.lessonsViewed.pop();

    if (!alreadyAdded) {
        const updateStudentInfo = await studentCollection.updateOne(
            { _id: convertedStudent },
            { $set: student },
        );

        if (updateStudentInfo.modifiedCount === 0)
            throw `Could not add lesson to student's recently viewed`;
    }

    return { lessonAdded: true };
};

const getRecentlyViewed = async (studentId) => {
    // validation functions later

    const studentCollection = await students();
    const convertedStudent = new ObjectId(studentId);

    const student = await studentCollection.findOne({ _id: convertedStudent });
    if (student === null) throw `Could not find student ${studentId}`;

    const lessonCollection = await lessons();
    let lessonList = [];

    for (let i = 0; i < student.lessonsViewed.length; i++) {
        let lessonId = new ObjectId(student.lessonsViewed[i]);
        let lesson = await lessonCollection.findOne({ _id: lessonId });
        lessonList.push({ id: student.lessonsViewed[i], name: lesson.name });
    }

    return lessonList;
};

const getStudentId = async (username) => {
    // validation
    if (!username) throw `Username not provided`;
    if (typeof username != 'string') throw `Username must be an alphanumeric string`;
    if (username.trim().length == 0) throw `Username cannot be empty`;
    for (let i = 0; i < username.length; i++) {
        if (
            username.charCodeAt(i) < 48 ||
            (username.charCodeAt(i) > 57 && username.charCodeAt(i) < 65) ||
            (username.charCodeAt(i) > 90 && username.charCodeAt(i) < 97) ||
            username.charCodeAt(i) > 122
        )
            throw `Username must be an alphanumeric string`;
    }

    const studentCollection = await students();
    const student = await studentCollection.findOne({ username: username });
    if (student === null) throw `Could not find student ${username}`;

    return student._id.toString();
};

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
    getRecentlyViewed,
    getStudentId,
    addViewedLesson,
};
