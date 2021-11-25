const mongoCollections = require('../config/mongoCollections');
const quizzes = mongoCollections.quizzes;
const { ObjectId } = require('mongodb');

module.exports = {

//---------------------CREATE A NEW QUIZ (By ADMIN/INSTRUCTORS)--------------------//
    async createQuiz(quizName,authorId,questions,answersCorrect){
    
        if(!quizName)
        {
            throw "The quizName is not provided";
        }

        if(typeof quizName !== "string")
        {
            throw "The quizName should be a string";
        }

        if(quizName.length == 0 || quizName.trim().length == 0)
        {
            throw "The quizName cannot be empty";
        }

        if(!authorId)
        {
            throw "The authorId is not provided";
        }

        if(typeof authorId !== "string")
        {
            throw "The authorId should be a string";
        }

        if(authorId.length == 0 || authorId.trim().length == 0)
        {
            throw "The authorId cannot be empty";
        }

        if(Array.isArray(questions) == false)
        {
            throw "The questions field needs to be an array";
        }

        if(questions.length == 0)
        {
            throw "The questions field cannot be empty";
        }

        for(let i=0;i<questions.length;i++)
        {
            if(typeof (questions[i]) !== "string")
            {
                throw "The element in questions should be a proper string";
            }
            
            if(questions[i].length == 0 || questions[i].trim().length == 0)
            {
                throw "The element in questions should not be an empty string";
            }
        }

        if(Array.isArray(answersCorrect) == false)
        {
            throw "The answersCorrect field needs to be an array";
        }

        if(answersCorrect.length == 0)
        {
            throw "The answersCorrect field cannot be empty";
        }

        for(let i=0;i<answersCorrect.length;i++)
        {
            if(typeof (answersCorrect[i]) !== "string")
            {
                throw "The element in answersCorrect should be a proper string";
            }
            
            if(answersCorrect[i].length == 0 || answersCorrect[i].trim().length == 0)
            {
                throw "The element in answersCorrect should not be an empty string";
            }
        }

        const quizCollection = await quizzes();

        let new_quiz = {

            quizName: quizName,
            authorId: authorId,
            questions: questions,
            answersCorrect: answersCorrect
        };

        const insertInfo = await quizCollection.insertOne(new_quiz);
        
        if (insertInfo.insertedCount === 0) throw 'We could not add a new quiz';

        const newId = insertInfo.insertedId;

        const quizInfo = await this.getQuizById(newId.toString());

        return quizInfo;
    },

//-----------------------GET QUIZ INFORMATION BY ID (By ADMIN/INSTRUCTORS)------------------------//
    async getQuizById(id){

        if (!id)
        {
            throw "The id parameter is not given";
        }

        if(typeof id !== "string")
        {
            throw "The id parameter should be of type string";
        }
        
        let given_id = id.trim();

        if(id.length == 0 || given_id.length == 0)
        {
            throw "The id parameter cannot be empty";
        }

        if(!ObjectId.isValid(id))
        {
            throw "The ObjectId is not valid";
        }

        let parsedId = ObjectId(id);

        const quizCollection = await quizzes();
        const quiz = await quizCollection.findOne({ _id: parsedId });

        if (quiz === null)
        {
            throw 'No quiz found for the given id';
        } 
        
        for(let i in quiz)
        {
            if(i == "_id")
            {
                quiz[i] = quiz[i].toString(); 
                break;
            }
        }

        return quiz;
    },

//-----------------REMOVE A PARTICULAR QUIZ (By ADMIN/INSTRUCTORS)-----------------/
    async removeQuiz(id){

        if(!id)
        {
            throw "The id parameter is not given";
        }

        if(typeof (id) !== "string")
        {
            throw "The id parameter should be of type string";
        }

        if(id.length == 0 || id.trim().length == 0)
        {
            throw "The id parameter cannot be empty";
        }

        if(!ObjectId.isValid)
        {
            throw "The ObjectId is not valid";
        }

        let parsedId = ObjectId(id);

        const quizCollection = await quizzes();

        const deletionInfo = await quizCollection.deleteOne({ _id: parsedId });

        if (!deletionInfo.deletedCount>0) {
            throw `Could not delete the quiz with the given id of ${id}`;
        }
        
        return `Successfully deleted the quiz with the given id ${id}`;
    },

//---------------------UPDATE A PARTICULAR QUIZ (By ADMIN/INSTRUCTORS)--------------------//
    async updateQuiz(id,quizName,authorId,questions,answersCorrect){

        if(!id)
        {
            throw "The id parameter is not given";
        }

        if(typeof id !== "string")
        {
            throw "The id parameter should be of type string";
        }

        if(id.length == 0 || id.trim().length == 0)
        {
            throw "The id parameter cannot be empty";
        }

        if(!quizName)
        {
            throw "The quizName is not provided";
        }

        if(typeof quizName !== "string")
        {
            throw "The quizName should be a string";
        }

        if(quizName.length == 0 || quizName.trim().length == 0)
        {
            throw "The quizName cannot be empty";
        }

        if(!authorId)
        {
            throw "The authorId is not provided";
        }

        if(typeof authorId !== "string")
        {
            throw "The authorId should be a string";
        }

        if(authorId.length == 0 || authorId.trim().length == 0)
        {
            throw "The authorId cannot be empty";
        }

        if(Array.isArray(questions) == false)
        {
            throw "The questions field needs to be an array";
        }

        if(questions.length == 0)
        {
            throw "The questions field cannot be empty";
        }

        for(let i=0;i<questions.length;i++)
        {
            if(typeof (questions[i]) !== "string")
            {
                throw "The element in questions should be a proper string";
            }
            
            if(questions[i].length == 0 || questions[i].trim().length == 0)
            {
                throw "The element in questions should not be an empty string";
            }
        }

        if(Array.isArray(answersCorrect) == false)
        {
            throw "The answersCorrect field needs to be an array";
        }

        if(answersCorrect.length == 0)
        {
            throw "The answersCorrect field cannot be empty";
        }

        for(let i=0;i<answersCorrect.length;i++)
        {
            if(typeof (answersCorrect[i]) !== "string")
            {
                throw "The element in answersCorrect should be a proper string";
            }
            
            if(answersCorrect[i].length == 0 || answersCorrect[i].trim().length == 0)
            {
                throw "The element in answersCorrect should not be an empty string";
            }
        }

        if(!ObjectId.isValid)
        {
            throw "The ObjectId is not valid";
        }

        let parsedId = ObjectId(id);

        const quizCollection = await quizzes();

        const updated_quiz = {
            
            quizName: quizName,
            authorId: authorId,
            questions: questions,
            answersCorrect: answersCorrect
        };

        const updateInfo = await quizCollection.updateOne(

            { _id: parsedId },
            { $set: updated_quiz }
        );

        if (updateInfo.modifiedCount == 0) {
            throw `There is no quiz with the given id of ${id}`;
        }

        return await this.getQuizById(id);
    }
    
}