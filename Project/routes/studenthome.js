const express = require('express');
const session = require('express-session');
const studentData = require('../data/students');
const instructorData = require('../data/instructors');
const lessonData = require('../data/lessons');
const quizData = require('../data/quizzes');

const router = express.Router();

router.get('/', async (req, res) => {
    const lessonList1 = []; //need student ID for this
    const lessonList2 = await lessonData.getSomeLessons(20);
    const quizList = await quizData.getSomeQuizzes(20);
    res.render('other/home', {layout: "studentLogin", heading: 'Recently Viewed', firstLessonList: lessonList1, secondLessonList: lessonList2, quizList: quizList});
})

module.exports = router;