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
		authorId: author, // this is a simple string right now, idk if we want to save as ObjectID or just string (will depend on instructor DB functions)
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
	
	return {lessonAdded: true};
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
	
	const lessonList = await lessonCollection.find({authorId: convertedId});
	
	if (lessonList === null) return [];
	return lessonList;
}

module.exports = {
	createLesson,
	getLesson,
	getMyLessons
}