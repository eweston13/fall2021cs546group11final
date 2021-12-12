const express = require('express');
const router = express.Router();
const data = require('../data');
const lessonsData = data.lessons;
const instructorData = data.instructors;
const studentData = data.students;

// validation functions (write later)


// routes

/*
	lesson-view.handlebars takes four parameters
		lessons: a list of related lessons to be displayed in a side nav with keys id and name
		lessonName: the title of the displayed lesson
		authorName: the name of the instructor who wrote the lesson (referenced by ID)
		lessonTags: a string list of all tags associated with the lesson
		lessonText: lesson content body, HTML encoding enabled
*/

/*
	edit-lesson-view takes five parameters
		id: the ID of the lesson being edited (for using in the POST), might not need this
		lessonName: the title of the lesson
		lessonTags: a string list of all tags associated with the lesson
		lessonBody: lesson content body, displayed in a froala rich text div
		questions: an array of questions associated with the lesson with keys questionText and reply
*/

//------------------------------ VIEW LESSON ID ------------------------------//
router.get('/view/:id', async (req, res) => {
	// gets lesson with ID :id and displays on lesson page
	const lessonId = req.params.id;
	const lesson = await lessonsData.getLesson(lessonId);
	
	const title = lesson.name;
	const authorId = lesson.authorId;
	const body = lesson.body;
	let tags = '';
	for (let i=0; i<lesson.tags.length; i++) {
		if (i==0) tags = lesson.tags[i];
		else tags = tags + ', ' + lesson.tags[i];
	}
	const questions = lesson.questions; // haven't added this to the handlebars yet lol
	
	const relatedLessons = await lessonsData.getMyLessons(authorId);
	
	let authorName = null;
	
	try {
		authorName = await instructorData.getInstructorName(authorId);
	} catch (e) {
		authorName = ''; // not sure if a deleted instructor should be left blank or indicate the instructor is no longer in the database
	}
	
	if (req.session.user == 'student') {
		let addLessonView = await studentData.addViewedLesson(req.session.userId, lessonId);
	}
	res.render('other/lesson-view', {extraStyles: '', lessons: relatedLessons, lessonName: title, authorName: authorName, lessonText: body, lessonTags: tags, questions: questions});
});

//------------------------------ EDIT LESSON ID ------------------------------//
router.get('/edit/:id', async (req, res) => {
	// edit lesson view of lesson :id
	try {
		const lessonId = req.params.id;
		const lesson = await lessonsData.getLesson(lessonId);
	
		const title = lesson.name;
		const body = lesson.body;
		const tags = lesson.tags;
		const questions = lesson.questions;
		
		// get questions from question collection
	
		res.render('other/edit-lesson-view', {extraStyles: '<link rel="stylesheet" href="../../public/css/lesson-edit-styles.css">', endpoint: `edit/${lessonId}`, lessonName: title, lessonAuthor: req.session.userId, lessonTags: tags, lessonText: body, questions: questions});
	} catch (e) {
		console.log(e);
		res.redirect('/home');
	}
});

//------------------------------ EDIT LESSON ID ------------------------------//
router.post('/edit/:id', async (req, res) => {
	const title = req.body.lessonTitle;
	const author = req.body.author;
	const body = req.body.lessonBody;
	const tags = req.body.lessonTagInput.split(',');
	// need to collect questions and replies
	
	// update lesson
	try {
		let updateLesson = await lessonsData.updateLesson(req.params.id, title, body, tags, []);
		res.redirect('/home');
	} catch (e) {
		res.status(500).json({error: e}).send();
	}
});

//------------------------------ CREATE NEW LESSON ------------------------------//
router.get('/new', async (req, res) => {
	try {
		res.render('other/edit-lesson-view', {extraStyles: '<link rel="stylesheet" href="../../public/css/lesson-edit-styles.css">', endpoint: 'new', lessonName: '', lessonAuthor: req.session.userId, lessonTags: '', lessonText: '', questions: []});
	} catch (e) {
		console.log(e);
	}
});

//------------------------------ CREATE NEW LESSON ------------------------------//
router.post('/new', async (req, res) => {
	// validate content
	const title = req.body.lessonTitle;
	const author = req.body.author;
	const body = req.body.lessonBody;
	const tags = req.body.lessonTagInput.split(',');
	
	try {
		let lessonCreation = await lessonsData.createLesson(title, author, body, tags);
		if (lessonCreation) res.redirect('/home'); // idk if this is really correct, but i think it should redirect to the instructor's user page
		else {
			console.log('ruh roh');
			res.status(500).send(); // elaborate on this later
		}
	} catch (e) {
		res.status(500).json({error: e}).send();
	}
});

module.exports = router;