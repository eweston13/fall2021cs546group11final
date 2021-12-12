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
    	const lessonList1 = await lessonData.getMyLessons(req.session.userId);
    	const lessonList2 = await lessonData.getSomeLessons(20);
    	const quizList = await quizData.getMyQuizzes(req.session.userId); // need to use instructor ID for this one too
    	res.render('other/home', {heading: 'My Lessons', firstLessonList: lessonList1, secondLessonList: lessonList2, quizList: quizList, newLesson: '<a href="/lesson/new">Add New Lesson</a>'});
    } catch (e) {
    	console.log(e);
    }
})



module.exports = router;