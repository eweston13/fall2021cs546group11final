const quizzes = require('./data/quizzes');
const grades = require('./data/grades')
const connection = require('./config/mongoConnection');
const students = require('./data/students');

const main = async () => {

//-----------------------------CREATE A QUIZ--------------------------------------//

    // try{
    //   const quiz = await quizzes.createQuiz("Capital","ghfghjgj",[{"question":"Capital of Australia","options": {"a":"Melbourne","b":"Canberra","c":"Sydney","d":"Perth"},"correctAnswer":"Canberra"},{"question":"Capital of Germany","options": {"a":"Munich","b":"Berlin","c":"Frankfurt","d":"Dortmund"},"correctAnswer":"Berlin"}]);
    //   console.log(quiz);
    // }catch(e){
    //   console.log (e);
    // }

//----------------------GET QUIZ INFO BY ID (FOR INSTRUCTORS)---------------------//

    // try{
    //     const quizInfo = await quizzes.getQuizById("61a140ca8ba15e1a57540c14");
    //     console.log(quizInfo);
    // }catch(e){
    //     console.log (e);
    // }

//-----------------------------REMOVE QUIZ INFO BY ID------------------------------//

    // try{
    //     const quizInfo = await quizzes.removeQuiz("61a02a24dc47b5a992b37fec");
    //     console.log(quizInfo);
    // }catch(e){
    //     console.log (e);
    // }

//-----------------------------UPDATE QUIZ----------------------------------------//

    // try{    
    //     const quizInfo = await quizzes.updateQuiz("61a02d55a6c6f9841a381543","Capital","shdg3khr43jt34",[{"question": "capital of Australia","options": ["Melbourne","Adelaide","Canberra"],"correctAnswer": "Canberra"},{"question":"capital of Italy","options": ["Rome","Milan"],"correctAnswer":"Rome"}]);
    //     console.log(quizInfo);
    // }catch(e){
    //     console.log (e);
    // }

//-------------------GET QUIZ INFO BY SEARCH TERM (FOR STUDENTS)----------------//

    // try{
    //     const quizInfo = await quizzes.getQuizByName("l");
    //     console.log(quizInfo);
    // }catch(e){
    //     console.log (e);
    // }

//-------------------------CREATE GRADES FOR STUDENTS (BY INSTRUCTORS)--------------------//

    // try{
    //     const gradesInfo = await grades.createGrades("61b111cad798ddc00d6d13d9",["Canberra","Berlin"],"61b02524abdc495555113682");
    //     console.log(gradesInfo);
    // }catch(e){
    //     console.log (e);
    // }

//-------------------------REMOVE GRADES FOR STUDENTS (BY INSTRUCTORS)----------------------//

    // try{
    //     const removeGrades = await grades.removeGrades("61b02524abdc495555113682","61b111cad798ddc00d6d13d9");
    //     console.log(removeGrades);
    // }catch(e){
    //     console.log (e);
    // }
    
//-------------------------GET GRADES OF ALL QUIZZES (FOR A STUDENT)---------------------------//

    // try{
    //     const allQuizInfo = await grades.getAllQuizGrades("61b02524abdc495555113682");
    //     console.log(allQuizInfo);
    // }catch(e){
    //     console.log (e);
    // }

//--------------------------GET DATA OF ALL QUIZZES OF ALL STUDENTS----------------------------//

    // try{
    //     const allQuizInfo = await grades.getAllStudents();
    //     console.log(allQuizInfo);
    // }catch(e){
    //     console.log (e);
    // }

//--------------------UPDATE GRADES OF A QUIZ FOR A STUDENT (BY INSTRUCTORS)---------------//
    
    // try{
    //     const allQuizInfo = await grades.editGrades("61b02524abdc495555113682","61b026143dc9a24afa534dd7", 0);
    //     console.log(allQuizInfo);
    // }catch(e){
    //     console.log (e);
    // }
    
    const db = await connection.connectToDb();
    await connection.closeConnection();
    console.log('Done!');
};



main().catch((error) => {
    console.log(error);
});