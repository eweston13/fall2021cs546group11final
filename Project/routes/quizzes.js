const express = require('express');
const session = require('express-session');
// const data = require('../data/users')
const studentData = require('../data/students')
const instructorData = require('../data/instructors')
const quizData = require('../data/quizzes')


const router = express.Router();


router.get('/',  async (req, res) =>{
    console.log("in quiz")
    let quizzes = await quizData.getAllQuizzes()
    console.log(quizzes)
    let nameList = []

    for(obj of quizzes){
        nameList.push(obj.quizName)
    }

    if(session.user == "student"){
        res.render("other/quizzes", {layout: "studentLogin" })
    }else{
        res.render("other/quizzes", {layout: "main", quizList: quizzes})
    }

})

router.get('/:id', async (req, res) => {

    let quiz = await quizData.getQuizById(req.params.id)
    // res.json(quiz)
//    console.log("quizName: ", quiz.quizName)

    let quizQuestions = quiz.quizData
    console.log("quiz questions: ", quizQuestions)

    // for(obj of quiz.quizData){
    //     quizQuestions.push()
    // }

    if(session.user == "student"){
        res.render("other/quiz-view", {layout: "studentLogin", quizTitle: quiz.quizName, questions: quizQuestions  })
    }else{
        res.render("other/quiz-view", {layout: "main", quizTitle: quiz.quizName, questions: quizQuestions })
    }

})








module.exports = router;