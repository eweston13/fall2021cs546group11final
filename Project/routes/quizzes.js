const express = require('express');
const router = express.Router();
const data = require('../data');
const quizData = data.quizzes;
const { ObjectId } = require('mongodb');

//-----------------CREATE A QUIZ (FOR INSTRUCTORS)----------------//

router.post('/', async (req, res) => {

    const new_quizData = req.body;

    if(!new_quizData.quizName)
    {
      res.status(400).json({ error: 'The quizName is not provided' });
      return;
    }

    if(typeof (new_quizData.quizName) !== "string")
    {
      res.status(400).json({ error: 'The quizName should be a string' });
      return;
    }

    if((new_quizData.quizName).length == 0 || (new_quizData.quizName).trim().length == 0)
    {
      res.status(400).json({ error: 'The quizName cannot be empty' });
      return;
    }

    if(!(new_quizData.authorId))
    {
      res.status(400).json({ error: 'The authorId is not provided' });
      return;
    }

    if(typeof (new_quizData.authorId) !== "string")
    {
      res.status(400).json({ error: 'The authorId should be a string' });
      return;
    }

    if((new_quizData.authorId).length == 0 || (new_quizData.authorId).trim().length == 0)
    {
      res.status(400).json({ error: 'The authorId cannot be empty' });
      return;
    }

    let quizInfo = [];

    if(Array.isArray(new_quizData.quizData) == false)
    {
        res.status(400).json({ error: 'The quizData should be an array' });
        return;
    }

    if((new_quizData.quizData).length == 0)
    {
        res.status(400).json({ error: 'The quizData should not be empty' });
        return;
    }

    for(let i=0;i<(new_quizData.quizData).length;i++)
    {
        if(!(new_quizData.quizData[i]['question']))
        {
          res.status(400).json({ error: 'The question is not provided' });
          return;
        }

        if(typeof (new_quizData.quizData[i]['question']) !== "string")
        {
          res.status(400).json({ error: 'The question should be a string' });
          return;
        }

        if((new_quizData.quizData[i]['question']).length == 0 || (new_quizData.quizData[i]['question']).trim().length == 0)
        {
          res.status(400).json({ error: 'The question cannot be empty' });
          return;
        }

        if(!(new_quizData.quizData[i]['options']))
        {
          res.status(400).json({ error: 'The options is not provided' });
          return;
        }

        if(Array.isArray((new_quizData.quizData[i]['options'])) == false)
        {
          res.status(400).json({ error: 'The options field should be an array' });
          return;
        }

        if((new_quizData.quizData[i]['options']).length == 0)
        {
          res.status(400).json({ error: 'The options field should not be empty' });
          return;
        }

        for(let j=0;j<(new_quizData.quizData[i]['options']).length;j++)
        {
            if(!(new_quizData.quizData[i]['options'][j])) 
            {
              res.status(400).json({ error: 'Please provide the answer option' });
              return;
            }

            if(typeof (new_quizData.quizData[i]['options'][j]) !== "string")
            {
              res.status(400).json({ error: 'The answer option should be a string' });
              return;  
            }

            if((new_quizData.quizData[i]['options'][j]).length == 0 || (new_quizData.quizData[i]['options'][j]).trim().length == 0)
            {
              res.status(400).json({ error: 'The answer option cannot be empty' });
              return;
            }
        }

        if(!new_quizData.quizData[i]['correctAnswer'])
        {
          res.status(400).json({ error: 'The correctAnswer is not provided' });
          return;
        }

        if(typeof (new_quizData.quizData[i]['correctAnswer']) !== "string")
        {
          res.status(400).json({ error: 'The correctAnswer should be a string' });
          return;
        }

        if((new_quizData.quizData[i]['correctAnswer']).length == 0 || (new_quizData.quizData[i]['correctAnswer']).trim().length == 0)
        {
          res.status(400).json({ error: 'The correctAnswer cannot be empty' });
          return;
        }

        quizInfo.push(new_quizData.quizData[i]);
    }

    try {
      const newQuiz = await quizData.createQuiz(new_quizData.quizName,new_quizData.authorId,quizInfo);
      res.json(newQuiz);
    } catch (e) {
      res.status(400).json({ error: e });
    }
});
//-------------GET QUIZ INFO BY ID (FOR INSTRUCTORS)--------------//

router.get('/:id', async (req, res) => {

    const id = req.params.id;
  
    if(!id)
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
        console.log(quizInfo);
        res.json(quizInfo);
      } catch (e) {
        res.status(404).json({ message: 'Quiz not found!' });
      }
});

//------------------GET QUIZ INFO BY NAME (FOR STUDENTS)----------------------//

router.get('/', async (req, res) => {

const searchName = req.body.searchName;

//console.log(searchName);
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

        if(quizInfo.length == 0)
        {
          res.status(400).json({ error: 'No quiz was found for the given search term' });
          return; 
        }
        else{
          res.json(quizInfo);
          return;
        }
        
      } catch (e) {
        res.status(404).json({ error: e });
      }
});

// //------------------DELETE A QUIZ BY ID (FOR INSTRUCTORS)---------------------//

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

//------------------UPDATE A QUIZ BY ID (FOR INSTRUCTORS)-------------------//

router.put('/:id', async (req, res) => {

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

    const toUpdatequiz = req.body;

    if(!toUpdatequiz.quizName)
    {
        res.status(400).json({ error: 'The quizName is not provided' });
        return;
    }

    if(typeof (toUpdatequiz.quizName) !== "string")
    {
        res.status(400).json({ error: 'The quizName should be a string' });
        return;
    }

    if((toUpdatequiz.quizName).length == 0 || (toUpdatequiz.quizName).trim().length == 0)
    {
        res.status(400).json({ error: 'The quizName cannot be empty' });
        return;
    }

    if(!(toUpdatequiz.authorId))
    {
        res.status(400).json({ error: 'The authorId is not provided' });
        return;
    }

    if(typeof (toUpdatequiz.authorId) !== "string")
    {
        res.status(400).json({ error: 'The authorId should be a string' });
        return;
    }

    if((toUpdatequiz.authorId).length == 0 || (toUpdatequiz.authorId).trim().length == 0)
    {
        res.status(400).json({ error: 'The authorId cannot be empty' });
        return;
    }

    let quizInfo = [];

    if(Array.isArray(toUpdatequiz.quizData) == false)
    {
        res.status(400).json({ error: 'The quizData should be an array' });
        return;
    }

    if((toUpdatequiz.quizData).length == 0)
    {
        res.status(400).json({ error: 'The quizData should not be empty' });
        return;
    }

    for(let i=0;i<(toUpdatequiz.quizData).length;i++)
    {
        if(!(toUpdatequiz.quizData[i]['question']))
        {
          res.status(400).json({ error: 'The question is not provided' });
          return;
        }

        if(typeof (toUpdatequiz.quizData[i]['question']) !== "string")
        {
          res.status(400).json({ error: 'The question should be a string' });
          return;
        }

        if((toUpdatequiz.quizData[i]['question']).length == 0 || (toUpdatequiz.quizData[i]['question']).trim().length == 0)
        {
          res.status(400).json({ error: 'The question cannot be empty' });
          return;
        }

        if(!(toUpdatequiz.quizData[i]['options']))
        {
          res.status(400).json({ error: 'The options is not provided' });
          return;
        }

        if(Array.isArray((toUpdatequiz.quizData[i]['options'])) == false)
        {
          res.status(400).json({ error: 'The options field should be an array' });
          return;
        }

        if((toUpdatequiz.quizData[i]['options']).length == 0)
        {
          res.status(400).json({ error: 'The options field should not be empty' });
          return;
        }

        for(let j=0;j<(toUpdatequiz.quizData[i]['options']).length;j++)
        {
            if(!(toUpdatequiz.quizData[i]['options'][j])) 
            {
              res.status(400).json({ error: 'Please provide the answer option' });
              return;
            }

            if(typeof (toUpdatequiz.quizData[i]['options'][j]) !== "string")
            {
              res.status(400).json({ error: 'The answer option should be a string' });
              return;  
            }

            if((toUpdatequiz.quizData[i]['options'][j]).length == 0 || (toUpdatequiz.quizData[i]['options'][j]).trim().length == 0)
            {
              res.status(400).json({ error: 'The answer option cannot be empty' });
              return;
            }
        }

        if(!toUpdatequiz.quizData[i]['correctAnswer'])
        {
          res.status(400).json({ error: 'The correctAnswer is not provided' });
          return;
        }

        if(typeof (toUpdatequiz.quizData[i]['correctAnswer']) !== "string")
        {
          res.status(400).json({ error: 'The correctAnswer should be a string' });
          return;
        }

        if((toUpdatequiz.quizData[i]['correctAnswer']).length == 0 || (toUpdatequiz.quizData[i]['correctAnswer']).trim().length == 0)
        {
          res.status(400).json({ error: 'The correctAnswer cannot be empty' });
          return;
        }

        quizInfo.push(toUpdatequiz.quizData[i]);
    }

    try {
        await quizData.getQuizById(req.params.id);
    } 
    catch (e) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
    }
    
    try {
        const updatedQuiz = await quizData.updateQuiz(req.params.id,toUpdatequiz.quizName,toUpdatequiz.authorId,quizInfo);
        res.json(updatedQuiz);
    } 
    catch (e) {
        res.status(500).json({ error: e});
    }
});
  module.exports = router;