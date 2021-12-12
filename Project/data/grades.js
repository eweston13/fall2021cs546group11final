const mongoCollections = require('../config/mongoCollections');
const quizzes = mongoCollections.quizzes;
const students = mongoCollections.students;

const ObjectId = require('mongodb').ObjectId;

// validation functions
function checkId (id) {
	if (!id) throw `No ID provided`;
	if (typeof id != 'string') throw `ID's must be 24-character alphanumeric strings`;
	if (id.length != 24) throw `ID's must be 24-character alphanumeric strings`;
	for (let i=0; i<id.length; i++) {
		let A = id.charCodeAt(i);
		if (A<48 || (A>57 && A<97) || A>122) throw `ID must consist of numbers and lowercase letters`;
	}
}

// db functions

//-----------------------CREATE GRADES FOR A SUBJECT (BY INSTRUCTORS)---------------------------//

async function createGrades(quizID,givenAnswers,studentID)
{
    if(!quizID){
        throw "The quizId is not given";
    }
    if(typeof quizID !== "string"){
        throw "The quizId should be a string";
    }
    if(quizID.length == 0 || quizID.trim().length == 0){
        throw "The quizId cannot be empty";
    }
    if(Array.isArray(givenAnswers) == false){
        throw "The givenAnswers should be an array";
    }
    if(givenAnswers.length == 0){
        throw "The givenAnswers should not be empty";
    }
    for(let i=0;i<givenAnswers.length;i++)
    {
        if(!givenAnswers[i]){
            throw "The attempted answer is not given";
        }
        if(typeof givenAnswers[i] !== "string"){
            throw "The attempted answer should be a string";
        }
        if(givenAnswers[i].length == 0 || givenAnswers[i].trim().length == 0){
            throw "The attempted answer cannot be empty";
        }
    }

    if(!studentID){
        throw "The studentId is not given";
    }
    if(typeof studentID !== "string"){
        throw "The studentId should be a string";
    }
    if(studentID.length == 0 || studentID.trim().length == 0){
        throw "The studentId cannot be empty";
    }

    let parsedId = ObjectId(quizID);

    const quizCollection = await quizzes();
    const quiz_found = await quizCollection.findOne({ _id: parsedId });

    if (quiz_found === null){
        throw "ERROR! No quiz was found for the given id";
    } 

    let quizName = quiz_found['quizName'];

    let no_right_answers = 0;
    let count = 0;
    let correctAnswersList = [];

    for(let i=0;i<quiz_found.quizData.length;i++)
    {
        correctAnswersList.push(quiz_found.quizData[i].correctAnswer);
    }

    for(let i=0;i<givenAnswers.length;i++)
    {
        count += 1;
        if(givenAnswers[i].toLowerCase() == correctAnswersList[i].toLowerCase()){
            no_right_answers += 1;
        } 
    }

    parsedId = ObjectId(studentID);

    const studentCollection = await students();
    const student_found = await studentCollection.findOne({ _id: parsedId });

    if (student_found === null){
        throw "ERROR! No student was found for the given id";
    }

    // let studentGrades = [];

    let gradesInfo = {};

    gradesInfo['quizId'] = quizID;
    gradesInfo['quizName'] = quizName;
    gradesInfo['grades'] = no_right_answers*10;

    const updateStudentInfo = await studentCollection.updateOne(

        { _id: parsedId },
        { $push: {
            quizzesCompleted:  gradesInfo } }
    );

    if (updateStudentInfo.modifiedCount == 0) {
        throw `ERROR! Could not update student information with the given id of ${studentID}`;
    }

    return gradesInfo;
    
}

//----------------REMOVE GRADES OF A PARTICULAR SUBJECT FOR A STUDENT (BY INSTRUCTOR)----------------//
async function removeGrades(studentID,quizId)
{
    if(!studentID){
        throw "The studentId is not given";
    }
    if(typeof studentID !== "string"){
        throw "The studentId should be a string";
    }
    if(studentID.length == 0 || studentID.trim().length == 0){
        throw "The studentId cannot be empty";
    }
    if(!ObjectId.isValid(studentID)){
        throw "The studentID is not a valid ObjectId";
    }
    if(!quizId){
        throw "The quizId is not given";
    }
    if(typeof quizId !== "string"){
        throw "The quizId should be a string";
    }
    if(quizId.length == 0 || quizId.trim().length == 0){
        throw "The quizId cannot be empty";
    }
    if(!ObjectId.isValid(quizId)){
        throw "The quizId is not a valid ObjectId";
    }

    let parsedId = ObjectId(studentID);

    const studentCollection = await students();
    const student_found = await studentCollection.findOne({ _id: parsedId });

    if (student_found === null){
        throw `ERROR! No student was found for the given id of ${studentID}`;
    }

    for(let i in student_found)
    {
        if(i=="_id"){
            student_found[i] = student_found[i].toString();
        }
    }

    let studentQuizInfo = student_found['quizzesCompleted'];

    let count = 0;
    let requiredQuizId = "";

    let requiredAnswer = "";

    for(let i=0;i<studentQuizInfo.length;i++)
    {
        if(studentQuizInfo[i]['quizId'] == quizId)
        {
            requiredQuizId = quizId;
            count += 1;
            break;
        }
    }

    if(count>0)
    {
        const deleteQuizInfo = await studentCollection.updateOne({
            "_id": parsedId
          },
          {
            "$pull": {
              "quizzesCompleted": {
                "quizId": requiredQuizId
              }
            }
          });

        if (deleteQuizInfo.modifiedCount == 0) {
            throw `ERROR! Could not delete quiz information with the given id of ${quizId}`;
        }else{
            requiredAnswer = `Successfully deleted the quiz having id ${quizId}`;
        }
    }
    else{
        throw `ERROR! No quiz was found for the given id of ${quizId}`
    }

   return requiredAnswer;
}

//--------------------GRADES OF ALL QUIZZES FOR A PARTICULAR STUDENT (FOR STUDENTS)--------------------//

async function getAllQuizGrades(studentID)
{
    if(!studentID){
        throw "The studentId is not given";
    }
    if(typeof studentID !== "string"){
        throw "The studentId should be a string";
    }
    if(studentID.length == 0 || studentID.trim().length == 0){
        throw "The studentId cannot be empty";
    }
    if(!ObjectId.isValid(studentID)){
        throw "The studentID is not a valid ObjectId";
    }  

    let parsedId = ObjectId(studentID);

    const studentCollection = await students();
    const student_found = await studentCollection.findOne({ _id: parsedId });

    if (student_found === null){
        throw `ERROR! No student was found for the given id of ${studentID}`;
    }

    for(let i in student_found)
    {
        if(i=="_id"){
            student_found[i] = student_found[i].toString();
        }
    }

    let studentQuizInfo = student_found['quizzesCompleted'];

    if(studentQuizInfo.length == 0){
        throw "Student has not given any quiz yet";
    }

    let requiredData = [];

    for(let i=0;i<studentQuizInfo.length;i++)
    {
        let quizData = {};

        for(let j in studentQuizInfo[i])
        {
            if(j == "quizName"){
                quizData['quizName'] = studentQuizInfo[i][j];
            }

            if(j == "grades"){
                quizData['grades'] = studentQuizInfo[i][j];
            }
        }
        requiredData.push(quizData);
    }

    return requiredData;
}

//-----------------------GET GRADES OF ALL QUIZZES OF ALL STUDENTS(BY INSTRUCTOR)-------------------//

async function getAllStudents()
{
    const studentCollection = await students();
    const allStudents = await studentCollection.find({}).toArray();
    
    for(let i=0;i<allStudents.length;i++)
    {
        for(let j in allStudents[i])
        {
            if(j == "_id"){
                allStudents[i][j] = allStudents[i][j].toString();
                break;
            }
        }
    }

    let requiredData = [];
    for(let i=0;i<allStudents.length;i++)
    {
        let studentName = "";
        
        let details = {};

        if(allStudents[i]['quizzesCompleted'].length == 0){
            continue;
        }
        else{
            studentName = allStudents[i]['firstName']+" "+allStudents[i]['lastName'];
            details['studentName'] = studentName;

            details['quizInfo'] = allStudents[i]['quizzesCompleted'];
        }
        requiredData.push(details);
    }

    return requiredData;
}

//-----------------------EDIT GRADES FOR STUDENTS------------------------//

async function editGrades(studentId,quizId,grades)
{
    if(!studentId){
        throw "The studentId is not given";
    }
    if(typeof studentId !== "string"){
        throw "The studentId should be a string";
    }
    if(studentId.length == 0 || studentId.trim().length == 0){
        throw "The studentId cannot be empty";
    }
    if(!ObjectId.isValid(studentId)){
        throw "The studentID is not a valid ObjectId";
    }
    if(!quizId){
        throw "The quizId is not given";
    }
    if(typeof quizId !== "string"){
        throw "The quizId should be a string";
    }
    if(quizId.length == 0 || quizId.trim().length == 0){
        throw "The quizId cannot be empty";
    }
    if(!ObjectId.isValid(quizId)){
        throw "The quizId is not a valid ObjectId";
    }
    if(grades == undefined){
        throw "Please enter the new grades";
    }
    if(typeof grades !== "number"){
        throw "The grades should be a numerical value";
    }

    let parsedId = ObjectId(studentId);

    const studentCollection = await students();
    const student_found = await studentCollection.findOne({ _id: parsedId });

    if (student_found === null){
        throw `ERROR! No student was found for the given id of ${studentId}`;
    }

    for(let i in student_found)
    {
        if(i=="_id"){
            student_found[i] = student_found[i].toString();
        }
    }
    let studentQuizInfo = student_found['quizzesCompleted'];
    //console.log(studentQuizInfo);
    let count = 0;
    let flag = -1;
    let requiredQuizId = "";

    let requiredAnswer = "";

    for(let i=0;i<studentQuizInfo.length;i++)
    {
        flag +=1;
        if(studentQuizInfo[i]['quizId'] == quizId)
        {
            requiredQuizId = quizId;
            count += 1;
            break;
        }
    }

    if(count>0)
    {
        const updateGrades = await studentCollection.updateOne({
            "_id": parsedId, 
            "quizzesCompleted.quizId": requiredQuizId
          },
          {
            "$set": {  
                "quizzesCompleted.$.grades": grades
            }
          });

        if (updateGrades.modifiedCount == 0) {
            throw `ERROR! Could not update grades information with the given quiz id of ${quizId}`;
        }else{
            requiredAnswer = `Successfully updated the grades having quiz id ${quizId}`;
        }
    }
    else{
        throw `ERROR! No quiz was found for the given id of ${quizId}`
    }

   return requiredAnswer;
}

// const getGrades = async (id) => {
// 	// get grades for student with ID id
// 	checkId(id);
	
//     const studentCollection = await students();
//     const studentId = new ObjectId(id);
    	
//     const student = await studentCollection.findOne({_id: studentId});
    	
//     if (student === null) throw `Couldn't find student ${id}`;
    	
//     return student.quizzesCompleted;
    	
// }

module.exports = {
	createGrades,
    removeGrades,
    getAllQuizGrades,
    getAllStudents,
	editGrades,
	getGrades
}