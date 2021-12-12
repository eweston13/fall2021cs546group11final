const express = require('express');
const session = require('express-session');
// const data = require('../data/users')
const studentData = require('../data/students')
const instructorData = require('../data/instructors')
const quizData = require('../data/quizzes')


const router = express.Router();


router.get('/',  async (req, res) =>{
//    console.log("in quiz")
    let quizzes = await quizData.getAllQuizzes()
    console.log(quizzes)
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

    let quiz = await quizData.getQuizById(req.params.id)
    // res.json(quiz)
//    console.log("quizName: ", quiz.quizName)

    let quizQuestions = quiz.quizData
//    console.log("quiz questions: ", quizQuestions)

    // for(obj of quiz.quizData){
    //     quizQuestions.push()
    // }
    // console.log("quiz id: ",quiz._id)
    // console.log("quiz id stringed: ", String(quiz._id))

    if(req.session.user == "student"){
        res.render("other/quiz-view", {layout: "studentLogin", quizId: String(quiz._id), quizTitle: quiz.quizName, questions: quizQuestions  })
    }else{
        res.render("other/quiz-view", {layout: "main", quizId: String(quiz._id), quizTitle: quiz.quizName, questions: quizQuestions })
    }

})

router.post('/:id', async(req, res) => {


    // console.log("here in quiz post")
    // console.log("The req body: ", req.body)
    // console.log("userId:", req.session.userId)

    // var reqSize = Object.keys(req.body).length
    var formatBody =  Object.values(req.body)

    // for(let i = 0; i < req.body.length; i++){
    //     formatBody.push(req.body.question)
    // }

    // console.log("the format body:", formatBody)

    let questionAnswers = Object.values(req.body)

    let gradequiz = await quizData.gradeQuiz(req.params.id, req.session.userId, questionAnswers)
    console.log(gradequiz)
})








module.exports = router;