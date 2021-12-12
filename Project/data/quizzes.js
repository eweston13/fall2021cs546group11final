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
                throw "The answer options is not provided";
            }

            if(typeof quizInfo[i]['options'] !== "object")
            {
                throw "The answer options should be an object";
            }

            if(!quizInfo[i]['options']['a'])
            {
                throw "The first answer option is not provided";
            }

            if(typeof quizInfo[i]['options']['a'] !== "string")
            {
                throw "The first answer should be a string";
            }

            if(quizInfo[i]['options']['a'].length == 0 || quizInfo[i]['options']['a'].trim().length == 0)
            {
                throw "The first answer cannot be empty";
            }

            if(!quizInfo[i]['options']['b'])
            {
                throw "The second answer option is not provided";
            }

            if(typeof quizInfo[i]['options']['b'] !== "string")
            {
                throw "The second answer should be a string";
            }

            if(quizInfo[i]['options']['b'].length == 0 || quizInfo[i]['options']['b'].trim().length == 0)
            {
                throw "The second answer cannot be empty";
            }

            if(!quizInfo[i]['options']['c'])
            {
                throw "The third answer option is not provided";
            }

            if(typeof quizInfo[i]['options']['c'] !== "string")
            {
                throw "The third answer should be a string";
            }

            if(quizInfo[i]['options']['c'].length == 0 || quizInfo[i]['options']['c'].trim().length == 0)
            {
                throw "The third answer cannot be empty";
            }

            if(!quizInfo[i]['options']['d'])
            {
                throw "The fourth answer option is not provided";
            }

            if(typeof quizInfo[i]['options']['d'] !== "string")
            {
                throw "The fourth answer should be a string";
            }

            if(quizInfo[i]['options']['d'].length == 0 || quizInfo[i]['options']['d'].trim().length == 0)
            {
                throw "The fourth answer cannot be empty";
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
                throw "The answer options is not provided";
            }

            if(typeof quizInfo[i]['options'] !== "object")
            {
                throw "The answer options should be an object";
            }

            if(!quizInfo[i]['options']['a'])
            {
                throw "The first answer option is not provided";
            }

            if(typeof quizInfo[i]['options']['a'] !== "string")
            {
                throw "The first answer should be a string";
            }

            if(quizInfo[i]['options']['a'].length == 0 || quizInfo[i]['options']['a'].trim().length == 0)
            {
                throw "The first answer cannot be empty";
            }

            if(!quizInfo[i]['options']['b'])
            {
                throw "The second answer option is not provided";
            }

            if(typeof quizInfo[i]['options']['b'] !== "string")
            {
                throw "The second answer should be a string";
            }

            if(quizInfo[i]['options']['b'].length == 0 || quizInfo[i]['options']['b'].trim().length == 0)
            {
                throw "The second answer cannot be empty";
            }

            if(!quizInfo[i]['options']['c'])
            {
                throw "The third answer option is not provided";
            }

            if(typeof quizInfo[i]['options']['c'] !== "string")
            {
                throw "The third answer should be a string";
            }

            if(quizInfo[i]['options']['c'].length == 0 || quizInfo[i]['options']['c'].trim().length == 0)
            {
                throw "The third answer cannot be empty";
            }

            if(!quizInfo[i]['options']['d'])
            {
                throw "The fourth answer option is not provided";
            }

            if(typeof quizInfo[i]['options']['d'] !== "string")
            {
                throw "The fourth answer should be a string";
            }

            if(quizInfo[i]['options']['d'].length == 0 || quizInfo[i]['options']['d'].trim().length == 0)
            {
                throw "The fourth answer cannot be empty";
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