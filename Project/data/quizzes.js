const mongoCollections = require('../config/mongoCollections');
const quizzes = mongoCollections.quizzes;
const { ObjectId } = require('mongodb');

module.exports = {

//---------------------CREATE A NEW QUIZ (By ADMIN/INSTRUCTORS)--------------------//
    async createQuiz(quizName,authorId,quizInfo){
    
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

        let quizData = [];

        if(Array.isArray(quizInfo) == false)
        {
            throw "The quizInfo should be an array";
        }

        if(quizInfo.length == 0)
        {
            throw "The quizInfo should not be empty";
        }

        for(let i=0;i<quizInfo.length;i++)
        {
            if(!quizInfo[i].question)
            {
                throw "The question is not provided";
            }

            if(typeof quizInfo[i].question !== "string")
            {
                throw "The question should be a string";
            }

            if(quizInfo[i].question.length == 0 || quizInfo[i].question.trim().length == 0)
            {
                throw "The question cannot be empty";
            }

            if(Array.isArray(quizInfo[i].options) == false)
            {
                throw "The answer options field should be an array";
            }

            if(quizInfo[i].options.length == 0)
            {
                throw "The answer options field should not be empty";
            }

            for(let j=0;j<quizInfo[i].options.length;j++)
            {
                if(!quizInfo[i].options[j]) 
                {
                    throw "Please provide the answer option";
                }

                if(typeof quizInfo[i].options[j] !== "string")
                {
                    throw "The answer option should be a string";
                }

                if(quizInfo[i].options[j].length == 0 || quizInfo[i].options[j].trim().length == 0)
                {
                    throw "The answer option cannot be empty";
                }
            }

            if(!quizInfo[i].correctAnswer)
            {
                throw "The correctAnswer is not provided";
            }

            if(typeof quizInfo[i].correctAnswer !== "string")
            {
                throw "The correctAnswer should be a string";
            }

            if(quizInfo[i].correctAnswer.length == 0 || quizInfo[i].correctAnswer.trim().length == 0)
            {
                throw "The correctAnswer cannot be empty";
            }

            quizData.push(quizInfo[i]);
        }

        const quizCollection = await quizzes();

        let new_quiz = {

            quizName: quizName.toLowerCase(),
            authorId: authorId,
            quizData: quizData
        };

        const insertInfo = await quizCollection.insertOne(new_quiz);
        
        if (insertInfo.insertedCount === 0) throw 'We could not add a new quiz';

        const newId = insertInfo.insertedId;

        const getquizInfo = await this.getQuizById(newId.toString());

        return getquizInfo;
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

        if(!ObjectId.isValid(id))
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
    async updateQuiz(id,quizName,authorId,quizInfo){

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

        let quizData = [];

        if(Array.isArray(quizInfo) == false)
        {
            throw "The quizInfo should be an array";
        }

        if(quizInfo.length == 0)
        {
            throw "The quizInfo should not be empty";
        }

        for(let i=0;i<quizInfo.length;i++)
        {
            if(!quizInfo[i]['question'])
            {
                throw "The question is not provided";
            }

            if(typeof quizInfo[i]['question'] !== "string")
            {
                throw "The question should be a string";
            }

            if(quizInfo[i]['question'].length == 0 || quizInfo[i]['question'].trim().length == 0)
            {
                throw "The question cannot be empty";
            }

            if(!quizInfo[i]['options'])
            {
                throw "The options is not provided";
            }


            if(Array.isArray(quizInfo[i]['options']) == false)
            {
                throw "The options field should be an array";
            }

            if(quizInfo[i]['options'].length == 0)
            {
                throw "The options field should not be empty";
            }

            for(let j=0;j<quizInfo[i]['options'].length;j++)
            {
                if(!quizInfo[i]['options'][j]) 
                {
                    throw "Please provide the answer option";
                }

                if(typeof quizInfo[i]['options'][j] !== "string")
                {
                    throw "The answer option should be a string";
                }

                if(quizInfo[i]['options'][j].length == 0 || quizInfo[i]['options'][j].trim().length == 0)
                {
                    throw "The answer option cannot be empty";
                }
            }

            if(!quizInfo[i]['correctAnswer'])
            {
                throw "The correctAnswer is not provided";
            }

            if(typeof quizInfo[i]['correctAnswer'] !== "string")
            {
                throw "The correctAnswer should be a string";
            }

            if(quizInfo[i]['correctAnswer'].length == 0 || quizInfo[i]['correctAnswer'].trim().length == 0)
            {
                throw "The correctAnswer cannot be empty";
            }

            quizData.push(quizInfo[i]);
        }

        if(!ObjectId.isValid(id))
        {
            throw "The ObjectId is not valid";
        }

        let parsedId = ObjectId(id);

        const quizCollection = await quizzes();

        const updated_quiz = {
            
            quizName: quizName.toLowerCase(),
            authorId: authorId,
            quizData: quizData
        };

        const updateInfo = await quizCollection.updateOne(

            { _id: parsedId },
            { $set: updated_quiz }
        );

        if (updateInfo.modifiedCount == 0) {
            throw `There is no quiz with the given id of ${id}`;
        }

        return await this.getQuizById(id);
    },
    
//--------------GET QUIZ BY NAME (FOR STUDENTS)-----------------//
    async getQuizByName(name)
    {

        if(!name)
        {
            throw "The name is not provided";
        }

        if(typeof name !== "string")
        {
            throw "The name should be of type string";
        }

        if(name.length == 0 || name.trim().length == 0)
        {
            throw "The name cannot be empty";
        }

        //let searchTerm = name.charAt(0).toUpperCase() + name.slice(1);

        let searchTerm = name.toLowerCase();

        const quizCollection = await quizzes();
        const quiz = await quizCollection.find({ "quizName": { $regex: searchTerm }}).toArray();

        if (quiz === null)
        {
            throw 'No quiz found with the provided search name';
        } 
        
        for(let a=0;a<quiz.length;a++)
        {
            for(let i in quiz[a])
            {
                if(i == "_id")
                {
                    quiz[a][i] = quiz[a][i].toString(); 
                    break;
                }
            }
        }
        

        return quiz;
    }
}