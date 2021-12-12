const express = require('express');
const router = express.Router();
const data = require('../data');
const quizData = data.quizzes;
const { ObjectId } = require('mongodb');


router.get('/', async (req, res) => {
    res.render('other/quizEditPost', {quizzes: []});
})

router.get('/quizCreate', async (req, res) => {
    res.render('quizCreation/quizCreate');
})

router.post('/quizCreate', async (req, res) => {
	// this route should be adding the quiz to the db then return to /quizEditPost
	const quizTitle = req.body[0].quizTitle;
	const quizAuthor = req.session.userId;
	let questions = [];
	for (let i=0; i<req.body.length; i++) {
		questions.push({
			question: req.body[i].question,
			options: [req.body[i].A, req.body[i].B, req.body[i].C, req.body[i].D],
			correctAnswer: req.body[i].correctAns
		});
	}
	
	// validate inputs
	
	
	// add quiz to db
	try {
		const quizId = await quizData.createQuiz(quizTitle, quizAuthor, questions);
		res.redirect('/quizEditPost');
	} catch (e) {
		console.log(e);
		res.redirect('/home');
	}
	
});

router.get('/quizEdit/:id', async (req, res) => {
    res.render('quizCreation/quizEdit');
})

router.get('*', async (req, res) => {
	res.redirect('/');
});




module.exports = router;


