const express = require('express');
const router = express.Router();
const data = require('../data');
const quizData = data.quizzes;
const { ObjectId } = require('mongodb');

//-------------GET QUIZ INFO BY ID (FOR INSTRUCTORS)--------------//

router.get('/:id', async (req, res) => {

    const id = req.params.id;
  
    if (!id)
    {
      res.status(400).json({ error: 'ID is not given' });
      return;
    }
  
    if(typeof id !== "string")
    {
      res.status(400).json({ error: 'ID is not a string' });
      return;
    }
  
    if(id.length == 0 || id.trim().length == 0)
    {
      res.status(400).json({ error: 'ID is empty' });
      return;
    }
  
    if(!ObjectId.isValid(id))
    {
        res.status(400).json({ error: 'The given id is not valid' });
        return;
    }

    try {
        const quizInfo = await quizData.getQuizById(req.params.id);
        res.json(quizInfo);
      } catch (e) {
        res.status(404).json({ message: 'Quiz not found!' });
      }
});

//------------------GET QUIZ INFO BY NAME (FOR STUDENTS)----------------------//

router.post('/', async (req, res) => {

const searchName = req.body["searchTerm"];

    if(!searchName)
    {
        res.status(400).json({ error: 'The search term is not provided' });
        return;
    }

    if(typeof searchName !== "string")
    {
        res.status(400).json({ error: 'The search term should be a string' });
        return;
    }

    if(searchName.length == 0 || searchName.trim().length == 0)
    {
      res.status(400).json({ error: 'The search term cannot be empty' });
      return;
    }

    try {
        const quizInfo = await quizData.getQuizByName(searchName);
        res.json(quizInfo);
      } catch (e) {
        res.status(404).json({ message: 'Quiz not found!' });
      }
});
//------------------DELETE A QUIZ BY ID (FOR INSTRUCTORS)---------------------//

router.delete('/:id', async (req, res) => {

    const id = req.params.id;

    if (!id)
    {
      res.status(400).json({ error: 'ID is not given' });
      return;
    }

    if(typeof id.toString() !== "string")
    {
      res.status(400).json({ error: 'ID is not a string' });
      return;
    }

    if(id.length == 0 || id.trim().length == 0)
    {
      res.status(400).json({ error: 'ID is empty' });
      return;
    }

    if(!ObjectId.isValid(id))
    {
      res.status(400).json({ error: 'Given id is not a valid ObjectID' });
      return;
    }

    try {
      await quizData.getQuizById(req.params.id);
    } catch (e) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }
    
    try {
      const remove_quiz = await quizData.removeQuiz(id);
      res.json(remove_quiz);
    } catch (e) {
      res.status(500).json({ error: e });
    }
});

  module.exports = router;