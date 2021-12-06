const express = require('express');
const router = express.Router();
const data = require('../data');
const quizData = data.quizzes;
const { ObjectId } = require('mongodb');


router.get('/', async (req, res) => {
    res.render('other/quizEditPost')
})

router.get('/quizCreate', async (req, res) => {
    res.render('quizCreation/quizCreate')
})

router.get('/quizEdit', async (req, res) => {
    res.render('quizCreation/quizEdit')
})






module.exports = router;


