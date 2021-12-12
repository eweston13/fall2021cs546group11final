const mongoCollections = require('../config/mongoCollections');
const quizzes = mongoCollections.quizzes;
const instructors = mongoCollections.instructors;
const students = mongoCollections.students;
const ObjectId = require('mongodb').ObjectId;

// validation functions
function validateName (name) {
	if (!name) throw `No title provided`;
	if (typeof name != 'string') throw `Quiz title must be a string`;
	if (name.trim().length == 0) throw `Quiz title cannot be empty`;
}

function validateDBID (id) {
	if (!id) throw `No ID provided`;
	if (typeof id != 'string') throw `ID's must be 24-character alphanumeric strings`;
	if (id.length != 24) throw `ID's must be 24-character alphanumeric strings`;
	for (let i=0; i<id.length; i++) {
		let A = id.charCodeAt(i);
		if (A<48 || (A>57 && A<97) || A>122) throw `ID must consist of numbers and lowercase letters`;
	}
}

function validateQuizInfo (data) {
	if (!data) throw `Quiz must have questions`;
	if (!Array.isArray(data)) throw `Quiz questions must be object array`;
	if (data.length == 0) throw `Quiz must have questions`;
	for (let i=0; i<data.length; i++) {
		if (!data[i].hasOwnProperty('question') || !data[i].hasOwnProperty('options') || !data[i].hasOwnProperty('correctAnswer') || Object.keys(data[i]).length != 3) throw `Each question must have question, options, and correctAnswer`;
		if (!Array.isArray(data[i].options)) throw `Question options must be a string array with length of 4`;
		if (data[i].options.length != 4) throw `Question options must be a string array with length of 4`;
		for (let j=0; j<data[i].options.length; j++) {
			if (typeof data[i].options[j] != 'string') throw `Question options must be a string array with length of 4`;
			if (data[i].options[j].trim().length == 0) throw `Question options cannot be empty strings`;
		}
		if (data[i].correctAnswer.length != 1) throw `correctAnswer must be A, B, C, or D`;
		if (data[i].correctAnswer.charCodeAt(0) < 65 || data[i].correctAnswer.charCodeAt(0) > 68)  throw `correctAnswer must be A, B, C, or D`;
	}
}

function validateQuizAttempt (data, questionCount) {
	if (!data) throw `Quiz attempt must have answers`;
	if (!Array.isArray(data)) throw `Quiz attempt must be an array of characters`;
	if (!questionCount) throw `The quiz must also have answers`;
	if (data.length != questionCount) throw `The quiz attempt is missing answers`;
	for (let i=0; i<data.length; i++) {
		if (data[i].length != 1) throw `Quiz attempt answers must be A, B, C, or D`;
		if (data[i].charCodeAt(0) < 65 || data[i].charCodeAt(0) > 68)  throw `Quiz attempt answers must be A, B, C, or D`;
	}
}

// db functions

//--------------------- CREATE NEW QUIZ (INSTRUCTORS) ---------------------//
const createQuiz = async (quizName, authorId, quizInfo) => {
	// validate inputs
	validateName(quizName);
	validateDBID(authorId);
	validateQuizInfo(quizInfo);
	
	const quizCollection = await quizzes();
	
	let newQuiz = {
		quizName: quizName,
		authorId: authorId,
		quizData: quizInfo
	};
	
	const insertInfo = await quizCollection.insertOne(newQuiz);
	if (insertInfo.insertedCount === 0) throw `Could not add quiz`;
	const quizId = insertInfo.insertedId.toString();
	
	// add quiz ID to instructor's list
	const instructorCollection = await instructors();
	
	const convertedAuthor = new ObjectId(authorId);
	let quizAuthor = await instructorCollection.findOne({_id: convertedAuthor});
	quizAuthor.quizzesCreated.push(quizId);
	
	const updateAuthorInfo = await instructorCollection.updateOne(
		{_id: convertedAuthor},
		{$set: quizAuthor}
	);
	if (updateAuthorInfo.modifiedCount === 0) throw `Could not add quiz to author`;
	
	return quizId;
}

//--------------------- EDIT EXISTING QUIZ (INSTRUCTORS) ---------------------//
const editQuiz = async (quizId, quizInfo) => {
	validateDBID(quizId);
	validateQuizInfo(data);
	
	const id = new ObjectId(quizId);
	const quizCollection = await quizzes();
	
	let quiz = await quizCollection.findOne({_id: id});
	if (quiz === null) throw `Could not find quiz ${quizId}`;
	quiz.quizData = quizInfo;
	
	const updateQuizInfo = await quizCollection.updateOne(
		{_id: id},
		{$set: quiz}
	);
	if (updateQuizInfo.modifiedCount === 0) throw `Could not update quiz`;
	
	return {quizUpdated: true};
	
}

const getMyQuizzes = async (id) => {
	validateDBID(id);
	
	const instructorCollection = await instructors();
	const authorId = new ObjectId(id);
	const author = await instructorCollection.findOne({_id: authorId});
	if (author === null) throw `Author not found`;
	
	const quizCollection = await quizzes();
	let quizList = [];
	
	for (let i=0; i<author.quizzesCreated.length; i++) {
		let quizId = new ObjectId(author.quizzesCreated[i]);
		let quiz = await quizCollection.findOne({_id: quizId});
		quizList.push({id: author.quizzesCreated[i], name: quiz.quizName});
	}
	
	return quizList;
	
}

const getSomeQuizzes = async (num) => {
	if (!num) throw `Must provide number of quizzes to return`;
	if (typeof num != 'number') throw `num must be a number`;
	if (num < 1) throw `Okay so that won't return anything`;
	
	const quizCollection = await quizzes();
	const quizList = await quizCollection.find({}).toArray();
	
	let formattedQuizzes = [];
	
	let limit = Math.min(num, quizList.length);
	
	for (let i=0; i<limit; i++) {
		formattedQuizzes.push({id: quizList[i]._id.toString(), name: quizList[i].quizName});
	}
	
	return formattedQuizzes;
}

const getQuizById = async (id) => {
	validateDBID(id);
	
	const quizCollection = await quizzes();
	const quizId = new ObjectId(id);
	
	const quiz = await quizCollection.findOne({_id: quizId});
	if (quiz === null) throw `Could not find quiz ${id}`;
	
	return quiz;
}

//--------------------- GRADE QUIZ (STUDENTS) ---------------------//
const gradeQuiz = async (quizId, studentId, quizData) => {
	// quizData should be in the form of an array consisting of characters A, B, C, and D to compare against correctAnswers
	
	validateDBID(quizId);
	validateDBID(studentId);
	
	const quizCollection = await quizzes();
	const convertedQuizId = new ObjectId(quizId);
	
	const quiz = await quizCollection.findOne({_id: convertedQuizId});
	const numQuestions = quiz.quizData.length;
	validateQuizAttempt(quizData, numQuestions);
	
	let numCorrect = 0;
	
	for (let i=0; i<numQuestions; i++) {
		if (quizData[i] == quiz.quizData[i].correctAnswer) numCorrect++;
	}
	
	// add score to student
	const studentCollection = await students();
	const convertedStudentId = new ObejctId(studentId);
	const student = await studentCollection.findOne({_id: convertedStudentId});
	student.quizzesCompleted.push({quizId: quizId, numCorrect: numCorrect, numQuestions: numQuestions});
	
	const updateStudentInfo = await studentCollection.updateOne(
		{_id: convertedStudentId},
		{$set: student}
	);
	if (updateStudentInfo.modifiedCount === 0) throw `Could not add score to student profile`;
	
	return numCorrect;
}



module.exports = {
	createQuiz,
	editQuiz,
	getMyQuizzes,
	getSomeQuizzes,
	getQuizById,
	gradeQuiz

/*
//---------------------CREATE A NEW QUIZ (By ADMIN/INSTRUCTORS)--------------------//
    async createQuiz(quizName,authorId,quizInfo){
    
        // if(!quizName)
        // {
        //     throw "The quizName is not provided";
        // }

        // if(typeof quizName !== "string")
        // {
        //     throw "The quizName should be a string";
        // }

        // if(quizName.length == 0 || quizName.trim().length == 0)
        // {
        //     throw "The quizName cannot be empty";
        // }

        // if(!authorId)
        // {
        //     throw "The authorId is not provided";
        // }

        // if(typeof authorId !== "string")
        // {
        //     throw "The authorId should be a string";
        // }

        // if(authorId.length == 0 || authorId.trim().length == 0)
        // {
        //     throw "The authorId cannot be empty";
        // }

        // let quizData = [];

        // if(Array.isArray(quizInfo) == false)
        // {
        //     throw "The quizInfo should be an array";
        // }

        // if(quizInfo.length == 0)
        // {
        //     throw "The quizInfo should not be empty";
        // }

        // for(let i=0;i<quizInfo.length;i++)
        // {
        //     if(!quizInfo[i].question)
        //     {
        //         throw "The question is not provided";
        //     }

        //     if(typeof quizInfo[i].question !== "string")
        //     {
        //         throw "The question should be a string";
        //     }

        //     if(quizInfo[i].question.length == 0 || quizInfo[i].question.trim().length == 0)
        //     {
        //         throw "The question cannot be empty";
        //     }

        //     if(Array.isArray(quizInfo[i].options) == false)
        //     {
        //         throw "The answer options field should be an array";
        //     }

        //     if(quizInfo[i].options.length == 0)
        //     {
        //         throw "The answer options field should not be empty";
        //     }

        //     for(let j=0;j<quizInfo[i].options.length;j++)
        //     {
        //         if(!quizInfo[i].options[j]) 
        //         {
        //             throw "Please provide the answer option";
        //         }

        //         if(typeof quizInfo[i].options[j] !== "string")
        //         {
        //             throw "The answer option should be a string";
        //         }

        //         if(quizInfo[i].options[j].length == 0 || quizInfo[i].options[j].trim().length == 0)
        //         {
        //             throw "The answer option cannot be empty";
        //         }
        //     }

        //     if(!quizInfo[i].correctAnswer)
        //     {
        //         throw "The correctAnswer is not provided";
        //     }

        //     if(typeof quizInfo[i].correctAnswer !== "string")
        //     {
        //         throw "The correctAnswer should be a string";
        //     }

        //     if(quizInfo[i].correctAnswer.length == 0 || quizInfo[i].correctAnswer.trim().length == 0)
        //     {
        //         throw "The correctAnswer cannot be empty";
        //     }

        //     quizData.push(quizInfo[i]);
        // }
        // console.log("test5")

        const quizCollection = await quizzes();
        // console.log("test6")

        let new_quiz = {

            quizName: quizName,
            authorId: authorId,
            quizData: quizInfo
        };
        // console.log("test7")

        const insertInfo = await quizCollection.insertOne(new_quiz);

        // console.log("test8")

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
*/
}