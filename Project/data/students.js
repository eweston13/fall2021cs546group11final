const mongoCollections = require('../config/mongoCollections');
const students = mongoCollections.students;
const bcrypt = require('bcrypt');
const saltRounds = 16;


async function addStudent(firstName, lastName, email, username, password, lessonsViewed, quizzesCompleted) {
    const studentCollection = await students();

    let newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    username: username,
    password: await bcrypt.hash(password, saltRounds),
    lessonsViewed: "placeholder",
    quizzesCompleted: "placeholder"
    }

    //REMEMBER TO MAKE USERNAMES LOWERCASE
    const newInsertInformation = await studentCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

    return newInsertInformation
}

async function checkStudent(uname, pass){


    const studentCollection = await students()

    let obj = await studentCollection.findOne({username: uname})

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
    let student1verif = await checkStudent("udaysama17", "Password")
    console.log("Student check:", student1verif)
}

//  test()



module.exports = {
    addStudent,
    checkStudent
}


