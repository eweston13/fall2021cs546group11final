const express = require('express');
const router = express.Router();
const data = require('../data');
const lessonsData = data.lessons;
const instructorData = data.instructors;

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
	const tags = lesson.tags;
	const questions = lesson.questions; // haven't added this to the handlebars yet lol
	
	const relatedLessons = await lessonsData.getMyLessons(authorId);
	
	let authorName = null;
	
	try {
		authorName = await instructorData.getInstructorName(authorId);
	} catch (e) {
		authorName = ''; // not sure if a deleted instructor should be left blank or indicate the instructor is no longer in the database
	}
	
	res.render('other/lesson-view', {extraStyles: '', lessons: relatedLessons, lessonName: title, authorName: authorName, lessonText: body});
});

//------------------------------ EDIT LESSON ID ------------------------------//
router.get('/edit/:id', async (req, res) => {
	// edit lesson view of lesson :id
	const lessonId = req.params.id;
	const lesson = await lessonsData.getLesson(lessonId);
	
	const title = lesson.name;
	const body = lesson.body;
	const tags = lesson.tags;
	const questions = lesson.questions;
	
	res.render('other/edit-lesson-view', {extraStyles: '<link rel="stylesheet" href="../../public/css/lesson-edit-styles.css">', endpoint: `edit/${lessonId}`, lessonName: title, lessonTags: tags, lessonText: body, questions: questions});
});

//------------------------------ EDIT LESSON ID ------------------------------//
router.post('/edit/:id', async (req, res) => {
	const title = req.body.lessonTitle;
	const author = req.body.author;
	const body = req.body.lessonBody;
	const tags = req.body.tags;
	// need to collect questions and replies
	
	// update lesson
});

//------------------------------ CREATE NEW LESSON ------------------------------//
router.get('/new', async (req, res) => {
	try {
		res.render('other/edit-lesson-view', {extraStyles: '<link rel="stylesheet" href="../../public/css/lesson-edit-styles.css">', endpoint: 'new', lessonName: '', lessonTags: '', lessonText: '', questions: []});
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
	const tags = req.body.tags;
	
	try {
		let lessonCreation = await lessonsData.createLesson(title, author, body, tags);
		if (lessonCreation.lessonAdded) res.redirect('/home'); // idk if this is really correct, but i think it should redirect to the instructor's user page
		else {
			res.status(500).send(); // elaborate on this later
		}
	} catch (e) {
		res.status(500).send();
	}
});

module.exports = router;