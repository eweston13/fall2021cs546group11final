const express = require('express');
const router = express.Router();
const data = require('../data');
const lessonsData = data.lessons;
const instructorData = data.instructors;

// validation functions (write later)


// routes

/*
	lesson-view.handlebars takes four parameters
		lessons: a list of related lessons to be displayed in a side nav
		lessonName: the title of the displayed lesson
		authorName: the name of the instructor who wrote the lesson (referenced by ID)
		lessonText: lesson content body, HTML encoding enabled
*/

router.get('/:id', async (req, res) => {
	// gets lesson with ID :id and displays on lesson page
	const lessonId = req.params.id;
	const lesson = await lessonsData.getLesson(lessonId);
	
	const title = lesson.name;
	const authorId = lesson.authorId;
	const body = lesson.body;
	const tags = lesson.tags;
	const questions = lesson.questions; // haven't added this to the handlebars yet lol
	
	const relatedLessons = await lessonsData.getMyLessons(authorId);
	
	try {
		let authorName = await instructorData.getInstructorName(authorId);
	} catch (e) {
		let authorName = ''; // not sure if a deleted instructor should be left blank or indicate the instructor is no longer in the database
	}
	
	res.render('other/lesson-view', {lessons: relatedLessons, lessonName: title, authorName: authorName, lessonText: body});
});

router.post('/', async (req, res) => {
	// validate content
	const title = req.body.title;
	const author = req.body.author;
	const body = req.body.lessonText;
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