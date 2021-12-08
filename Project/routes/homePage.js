const express = require('express');
const session = require('express-session');
const studentData = require('../data/students')
const instructorData = require('../data/instructors')

const router = express.Router();

router.get('/', async (req, res) => {
    console.log("here");
    try {
    	res.render('other/home', {heading: 'My Lessons', firstLessonList: [], secondLessonList: [], quizList:[]});
    } catch (e) {
    	console.log(e);
    }
})



module.exports = router;