const mongoCollections = require('./../config/mongoCollections');
const instructors = mongoCollections.instructors;
const lessons = mongoCollections.lessons;
const ObjectId = require('mongodb').ObjectId;

// validation functions
function validateInstructorId (id) {

}

function validateLessonId (id) {

}

function validateTags (tags) {

}

// database functions
const createLesson = async (name, author, body, tags) => {
	// this function creates a new lesson object and sends it to the database
	// validate first
	
	const lessonCollection = await lessons();
	
	let newLesson = {
		name: name,
		authorId: author, // this is a simple string, not object id
		body: body,
		tags: tags,
		questions: [] // i think this should be an object array of the question key-value pair, and the answers key-value pair where the value of answers is its own array of the replies on the corresponding question
		/*
			ADDITIONAL COMMENT FOR CLARIFICATION
			{[
				{question: questionId,
				replies: [replyId1, replyId2, replyId3, etc]
				},
				{question: questionId2,
				replies: [replyId4, replyId5, replyId6, etc]
				}
			]}
		*/
	};
	
	const insertInfo = await lessonCollection.insertOne(newLesson);
	if (insertInfo.insertedCount === 0) throw `Could not add lesson`;
	const lessonId = insertInfo.insertedId.toString();
	
	// now add lesson Id to instructor's list
	const instructorCollection = await instructors();
	
	const convertedAuthor = ObjectId(author);
	let lessonAuthor = await instructorCollection.findOne({_id: convertedAuthor});
	lessonAuthor.lessonsCreated.push(lessonId);
	
	const updateAuthorInfo = await instructorCollection.updateOne(
		{_id: convertedAuthor},
		{$set: lessonAuthor}
	);
	if (updateAuthorInfo.modifiedCount === 0) throw `Could not add lesson to author`;
	
	return lessonId;
}

const getLesson = async (id) => {
	// this function gets a specific lesson object with ID of id
	// validate first
	
	const lessonCollection = await lessons();
	let convertedId = new ObjectId(id);
	
	const lesson = await lessonCollection.findOne({_id: convertedId});
	
	if (lesson === null) throw `Could not retrieve lesson info`;
	return lesson;
}

const getMyLessons = async (id) => {
	// this function gets all lessons created by the instructor with the ID of id
	// validate authorId
	
	let convertedId = new ObjectId(id);
	const lessonCollection = await lessons();
	
	const lessonList = await lessonCollection.find({authorId: convertedId}).toArray( function (err, result) {
		if (err) throw err;
		console.log(result);
	});
	
	/*if (lessonList.length === 0) */return [];
	//return lessonList;
}

const addQuestion = async (lessonId, question) => {
	// this function adds a question to a lesson
	
}

const addReply = async (lessonId, questionId, reply) => {
	// this function adds a reply to a question on a lesson
	
}

module.exports = {
	createLesson,
	getLesson,
	getMyLessons,
	addQuestion,
	addReply
}