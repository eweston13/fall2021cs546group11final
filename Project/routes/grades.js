const express = require('express');
const router = express.Router();
const data = require('../data');
const gradesData = data.grades;
const { ObjectId } = require('mongodb');

//--------------------------ASSIGNING GRADES TO STUDENTS------------------------------//

router.post('/', async (req, res) => {

    const data = req.body;

    if(!data.quizID){
      res.status(400).json({ error: 'The quizID is not provided' });
      return;
    }
    if(typeof data.quizID !== "string"){
        res.status(400).json({ error: 'The quizId should be a string' });
        return;
    }
    if((data.quizID).length == 0 || (data.quizID).trim().length == 0){
        res.status(400).json({ error: 'The quizId cannot be empty' });
        return;
    }
    if(!ObjectId.isValid(data.quizID)){
        res.status(400).json({ error: 'Given quizID is not a valid ObjectID' });
        return;
    }
    if(!data.givenAnswers){
        res.status(400).json({ error: 'The givenAnswers is not provided' });
        return;
    }
    if(Array.isArray(data.givenAnswers) == false){
        res.status(400).json({ error: 'The givenAnswers should be an array' });
        return;
    }
    if((data.givenAnswers).length == 0){
        res.status(400).json({ error: 'The givenAnswers should not be empty' });
        return;
    }
    for(let i=0;i<(data.givenAnswers).length;i++)
    {
        if(!data.givenAnswers[i]){
            res.status(400).json({ error: 'The attempted answer is not given' });
            return;
        }
        if(typeof data.givenAnswers[i] !== "string"){
            res.status(400).json({ error: 'The attempted answer should be a string' });
            return;
        }
        if(data.givenAnswers[i].length == 0 || data.givenAnswers[i].trim().length == 0){
            res.status(400).json({ error: 'The attempted answer cannot be empty' });
            return;
        }
    }

    if(!data.studentID){
        res.status(400).json({ error: 'The studentId is not given' });
        return;
    }
    if(typeof data.studentID !== "string"){
        res.status(400).json({ error: 'The studentId should be a string' });
        return;   
    }
    if(data.studentID.length == 0 || data.studentID.trim().length == 0){
        res.status(400).json({ error: 'The studentId cannot be empty' });
        return;
    }
    if(!ObjectId.isValid(data.studentID)){
        res.status(400).json({ error: 'Given studentID is not a valid ObjectID' });
        return;
    }

    try {
        const newGrade = await gradesData.createGrades(data.quizID,data.givenAnswers,data.studentID);
        res.json(newGrade);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

//-------------------DELETING GRADES OF A QUIZ OF A PARTICULAR STUDENT--------------------//
router.delete('/', async (req, res) => {

    const studentID = req.body['studentID'];
    const quizId = req.body['quizId'];

    if(!studentID){
        res.status(400).json({ error: 'The studentID is not provided' });
        return;
    }
    if(typeof studentID !== "string"){
        res.status(400).json({ error: 'The studentId should be a string' });
        return;
    }
    if(studentID.length == 0 || studentID.trim().length == 0){
        res.status(400).json({ error: 'The studentId cannot be empty' });
        return;
    }
    if(!ObjectId.isValid(studentID)){
        res.status(400).json({ error: 'The studentID is not a valid ObjectId' });
        return;
    }
    if(!quizId){
        res.status(400).json({ error: 'The quizId is not given' });
        return;
    }
    if(typeof quizId !== "string"){
        res.status(400).json({ error: 'The quizId should be a string' });
        return;
    }
    if(quizId.length == 0 || quizId.trim().length == 0){
        res.status(400).json({ error: 'The quizId cannot be empty' });
        return;     
    }
    if(!ObjectId.isValid(quizId)){
        res.status(400).json({ error: 'The quizId is not a valid ObjectId' });
        return;
    }
    try {
        const removedData = await gradesData.removeGrades(studentID,quizId);
        res.json(removedData);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

//--------------------GRADES OF ALL QUIZZES FOR A PARTICULAR STUDENT (FOR STUDENTS)--------------------//

router.get('/:id', async (req, res) => {

    const studentId = req.params.id;

    if(!studentId){
        res.status(400).json({ error: 'The studentId is not provided' });
        return;
    }
    if(typeof studentId !== "string"){
        res.status(400).json({ error: 'The studentId should be a string' });
        return;
    }
    if(studentId.length == 0 || studentId.trim().length == 0){
        res.status(400).json({ error: 'The studentId cannot be empty' });
        return;
    }
    if(!ObjectId.isValid(studentId)){
        res.status(400).json({ error: 'The studentId is not a valid ObjectId' });
        return;
    }
    try {
        const getAllQuizData = await gradesData.getAllQuizGrades(studentId);
        res.json(getAllQuizData);
        //res.render('other/studentGrade',getAllQuizData);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

//-----------------------GET GRADES OF ALL QUIZZES OF ALL STUDENTS(BY INSTRUCTOR)-------------------//

router.get('/', async (req, res) => {

    try {
        const getAllStudentsData = await gradesData.getAllStudents();
        res.json(getAllStudentsData);
        //res.render('other/instructorGrade',getAllStudentsData);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

//-------------------------EDIT GRADES FOR STUDENTS (BY INSTRUCTOR)------------------------//

router.put('/', async (req, res) => {

    const data = req.body;
    if(!data.studentId){
        res.status(400).json({ error: 'The studentId is not provided' });
        return;
    }
    if(typeof data.studentId !== "string"){
        res.status(400).json({ error: 'The studentId should be a string' });
        return;
    }
    if(data.studentId.length == 0 || data.studentId.trim().length == 0){
        res.status(400).json({ error: 'The studentId cannot be empty' });
        return;
    }
    if(!ObjectId.isValid(data.studentId)){
        res.status(400).json({ error: 'The studentId is not a valid ObjectId' });
        return;
    }
    if(!data.quizId){
        res.status(400).json({ error: 'The quizId is not given' });
        return;
    }
    if(typeof data.quizId !== "string"){
        res.status(400).json({ error: 'The quizId should be a string' });
        return;
    }
    if(data.quizId.length == 0 || data.quizId.trim().length == 0){
        res.status(400).json({ error: 'The quizId cannot be empty' });
        return;
    }
    if(!ObjectId.isValid(data.quizId)){
        res.status(400).json({ error: 'The quizId is not a valid ObjectId' });
        return;
    }
    if(data.grades == undefined){
        res.status(400).json({ error: 'Please enter the new grades' });
        return;
    }
    if(typeof data.grades !== "number"){
        res.status(400).json({ error: 'The grades should be a numerical value' });
        return;
    }    

    try {
        const updateGrade = await gradesData.editGrades(data.studentId,data.quizId,data.grades);
        res.json(updateGrade);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});
module.exports = router;