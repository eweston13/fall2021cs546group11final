const express = require('express');
const session = require('express-session');
const studentData = require('../data/students');
const instructorData = require('../data/instructors');
const quizData = require('../data/quizzes');
const lessonData = require('../data/lessons');

const router = express.Router();

router.get('/', async (req, res) => {
    console.log("here");
    try {
    	const lessonList1 = []; // need to figure out how to get current instructor ID first
    	const lessonList2 = [];
    	const quizList = []; // need to use instructor ID for this one too
    	res.render('other/home', {heading: 'My Lessons', firstLessonList: lessonList1, secondLessonList: lessonList2, quizList: quizList});
    } catch (e) {
    	console.log(e);
    }
})



module.exports = router;