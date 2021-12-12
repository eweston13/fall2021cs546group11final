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
		res.render('other/home', {heading: 'My Lessons', firstLessonList: lessonList1, secondLessonList: lessonList2, newLesson: '<a href="/lesson/new">Add New Lesson</a>'});

    } catch (e) {
    	console.log(e);
    }
});

router.post('/', async (req, res) => {
	const lessonList1 = await lessonData.getMyLessons(req.session.userId);
	const lessonList2 = await lessonData.getLessonsByTag(req.body.searchTerm.toLowerCase());
	res.render('other/home', {heading: 'My Lessons', firstLessonList: lessonList1, secondLessonList: lessonList2, newLesson: '<a href="/lesson/new">Add New Lesson</a>'});
});

module.exports = router;