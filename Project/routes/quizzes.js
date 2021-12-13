const express = require('express');
const session = require('express-session');
// const data = require('../data/users')
const studentData = require('../data/students')
const instructorData = require('../data/instructors')
const quizData = require('../data/quizzes')
const ObjectId = require('mongodb').ObjectId;


const router = express.Router();


router.get('/',  async (req, res) =>{
//    console.log("in quiz")
    let quizzes = await quizData.getAllQuizzes()
//    console.log(quizzes)
    let nameList = []

    for(obj of quizzes){
        nameList.push(obj.quizName)
    }

    if(req.session.user == "student"){
        res.render("other/quizzes", {layout: "studentLogin",  quizList: quizzes })
    }else{
        res.render("other/quizzes", {layout: "main", quizList: quizzes})
    }

})

router.get('/:id', async (req, res) => {
    // var idTest = new ObjectId(req.params.id)
    // if(idTest){

    // }

    let quiz = await quizData.getQuizById(req.params.id)
    

    let quizQuestions = quiz.quizData

    if(req.session.user == "student"){
        res.render("other/quiz-view", {layout: "studentLogin", quizId: String(quiz._id), quizTitle: quiz.quizName, questions: quizQuestions  })
    }else{
        res.render("other/quiz-view", {layout: "main", quizId: String(quiz._id), quizTitle: quiz.quizName, questions: quizQuestions, error: "Instructor Cannot submit a Quiz" })
    }

})

router.post('/:id', async(req, res) => {

    let quiz = await quizData.getQuizById(req.params.id)
    let quizQuestions = quiz.quizData

    // console.log("here in quiz post")
//    console.log("The req body: ", req.body)
    // console.log("userId:", req.session.userId)

    // var reqSize = Object.keys(req.body).length
    var formatBody =  Object.values(req.body)

    // for(let i = 0; i < req.body.length; i++){
    //     formatBody.push(req.body.question)
    // }

    // console.log("the format body:", formatBody)


    let questionAnswers = Object.values(req.body)
    
    var gradequiz

    if(req.session.user == "instructor"){
        res.status(400).render("other/quiz-view", {layout: "main", quizId: String(quiz._id), quizTitle: quiz.quizName, questions: quizQuestions, error: "Instructor Cannot submit a Quiz" })
        return
    }

    // if(!id){
    //     res.status(400).render("other/quiz-view", {layout: "studentLogin", quizId: String(quiz._id), quizTitle: quiz.quizName, questions: quizQuestions, error: e})
    //     return 
    //}

    try{
        gradequiz = await quizData.gradeQuiz(req.params.id, req.session.userId, questionAnswers)
        res.redirect('/login')
    }catch (e){
        res.status(400).render("other/quiz-view", {layout: "studentLogin", quizId: String(quiz._id), quizTitle: quiz.quizName, questions: quizQuestions, error: e})
    }
   
    console.log(gradequiz)

})

router.post('/:id/delete', async(req, res) =>{

    let quizzes = await quizData.getAllQuizzes()

    if(req.session.user == "student"){
        res.render("other/quizzes", {layout: "studentLogin",  quizList: quizzes, error: "Cannot delete quiz as a student, nice try : )"})
        return
    }
    
    // if(!id){
    //     res.status(400).render({layout: "main",  quizList: quizzes, error: "id must be provided" })
    //     return 
    // }

    try{
        await quizData.removeQuiz(req.params.id)
        res.redirect('/quiz')
    }catch (e){
        res.render("other/quizzes", {layout: "main",  quizList: quizzes, error: e })
    }
})







module.exports = router;