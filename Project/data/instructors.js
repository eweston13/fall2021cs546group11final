const mongoCollections = require('../config/mongoCollections');
const instructors = mongoCollections.instructors;
const bcrypt = require('bcrypt');
const saltRounds = 16;


async function addInstructor(firstName, lastName, email, username, password, lessonsCreated) {
    const instructorCollection = await instructors();

    let newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    username: username,
    password: await bcrypt.hash(password, saltRounds),
    lessonsCreated: "placeholder",
    }

    const newInsertInformation = await instructorCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

    return newInsertInformation
}

async function checkInstructor(uname, pass){

    const instructorCollection = await instructors()

    let obj = await instructorCollection.findOne({username: uname})

    var passCheck
    try{
        passCheck = await bcrypt.compare(pass, obj.password);
    }catch(e){
        console.log(e)
    }

    if(passCheck && uname == obj.username){
        return {authenticated: true}
    }

    throw "Either the username or password is invalid"
}

//function test is used just to test individual functions to see if they work, seed file must be run first
async function test(){
    let instructor1verif = await checkInstructor("pathill14", "Password123")
    console.log("Instructor check:", instructor1verif)
}

// test()

module.exports = {
    addInstructor,
    checkInstructor
};
