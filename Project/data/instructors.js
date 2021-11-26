const mongoCollections = require('../config/mongoCollections');
const instructors = mongoCollections.instructors;
const bcrypt = require('bcrypt');
const saltRounds = 16;


async function addInstructor(firstName, lastName, email, username, password, lessonsCreated) {
    
    if(!username || !password) throw "Username and password both must be supplied"
    if(username == ''.repeat(username.length)) throw "Username cannot be only spaces"
    if(username.length < 4) throw "Username must be at least 4 letters long"
    if(/^[a-zA-Z0-9]*$/.test(username) == false) throw "Username should be alphanumeric"

    if(password.length < 6) throw "Password must be at least 6 letters long"
    if(password.includes(' ')) throw "Password cannot contain a space"

    const instructorCollection = await instructors();

    let userExists = await instructorCollection.findOne({username: username});
    if(userExists) throw "Username already exists in system";
    

    let newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    username: username.toLowerCase(),
    password: await bcrypt.hash(password, saltRounds),
    lessonsCreated: "placeholder",
    }

    const newInsertInformation = await instructorCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

    return {userInserted: true}
}

async function checkInstructor(username, pass){


    if(!username || !pass) throw "Username and password both must be supplied"
    if(username == ''.repeat(username.length)) throw "Username cannot be only spaces"
    if(username.length < 4) throw "Username must be at least 4 letters long"
    if(/^[a-zA-Z0-9]*$/.test(username) == false) throw "Username should be alphanumeric"
    if(pass < 6) throw "Password must be at least 6 letters long"
    if(pass.includes(' ')) throw "Password cannot contain a space"
    
    const instructorCollection = await instructors()
    username = username.toLowerCase()
    let obj = await instructorCollection.findOne({username: username})

    var passCheck
    try{
        passCheck = await bcrypt.compare(pass, obj.password);
    }catch(e){
        console.log(e)
    }

    if(passCheck && username == obj.username){
        return {authenticated: true}
    }

    throw "Either the username or password is invalid"
}

//function test is used just to test individual functions to see if they work, seed file must be run first
async function test(){
    let instructor1verif = await checkInstructor("pathill14", "Password123")
    console.log("Instructor check:", instructor1verif)
}



module.exports = {
    addInstructor,
    checkInstructor
};
