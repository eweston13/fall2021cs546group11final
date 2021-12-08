const mongoCollections = require('./../config/mongoCollections');
const instructors = mongoCollections.instructors;
const students = mongoCollections.students;
const lessons = mongoCollections.lessons;
const questions = mongoCollections.questions;
const ObjectId = require('mongodb').ObjectId;

// validation functions
function validateDBID (id) {
	if (!id) throw `No ID provided`;
	if (typeof id != 'string') throw `ID's must be 24-character alphanumeric strings`;
	if (id.length != 24) throw `ID's must be 24-character alphanumeric strings`;
	for (let i=0; i<id.length; i++) {
		let A = id.charCodeAt(i);
		if (A<48 || (A>57 && A<97) || A>122) throw `ID must consist of numbers and lowercase letters`;
	}
}

function validateTextInput (text) {
	if (!text) throw `No text provided`;
	if (typeof text != 'string') throw `Text must be a string`;
	if (text.trim().length == 0) throw `Text must not be empty`;
}

function validateTags (tags) {
	// a lesson can in fact have no tags, just the tags variable should be []
	if (!tags) throw `No tags provided`;
	if (!Array.isArray(tags)) throw `Tags must be in the form of an array`;
	if (tags.length > 0) {
		for (let i=0; i<tags.length; i++) {
			if (typeof tags[i] != 'string') throw `Tags must be an array of strings`;
		}
	}
}

// database functions
const createLesson = async (name, author, body, tags) => {
	// this function creates a new lesson object and sends it to the database
	// validate first
	validateTextInput(name);
	validateDBID(author);
	validateTextInput(body);
	validateTags(tags);
	
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
	
	const convertedAuthor = new ObjectId(author);
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
	validateDBID(id);
	
	const lessonCollection = await lessons();
	let convertedId = new ObjectId(id);
	
	const lesson = await lessonCollection.findOne({_id: convertedId});
	
	if (lesson === null) throw `Could not retrieve lesson info`;
	return lesson;
}

const getMyLessons = async (id) => {
	// this function gets all lessons created by the instructor with the ID of id
	// validate authorId
	validateDBID(id);
	
	let convertedId = new ObjectId(id);
	const instructorCollection = await instructors();
	const lessonCollection = await lessons();
	
	const instructor = await instructorCollection.findOne({_id: convertedId});
	
	if (instructor === null) throw `Could not find instructor ${id}`;
	
	let lessonList = [];
	
	for (let i=0; i<instructor.lessonsCreated.length; i++) {
		let lessonId = new ObjectId(instructor.lessonsCreated[i]);
		let lesson = await lessonCollection.findOne({_id: lessonId});
		
		if (lesson === null) throw `Could not find lesson ${lessonId}`;
		
		lessonList.push(lesson);
	}
	
	if (lessonList.length === 0) return [];
	return lessonList;
}

const addQuestion = async (lessonId, studentId, question) => {
	// this function adds a question to a lesson
	validateDBID(lessonId);
	validateDBID(studentId);
	validateTextInput(question);
	
	const questionCollection = await questions();
	const lessonCollection = await lessons();
	const studentCollection = await students();
	
	let newQuestion = {
		question: question,
		replies: []
	};
	
	// add question to questions collection
	const insertInfo = await questionCollection.insertOne(newQuestion);
	if (insertInfo.insertedCount === 0) throw `Could not add question`;
	const questionId = insertInfo.insertedId.toString();
	
	// add question id to student's info
	const convertedStudent = new ObjectId(studentId);
	let student = await studentCollection.findOne({_id: convertedStudent});
	student.questionsAsked.push(questionId);
	
	const updateStudentInfo = await studentCollection.updateOne(
		{_id: convertedStudent},
		{$set: student}
	);
	if (updateStudentInfo.modifiedCount === 0) throw `Could not add question (student)`;
	
	// add question id to lesson's info
	const convertedLesson = new ObjectId(lessonId);
	let lesson = await lessonCollection.findOne({_id: convertedLesson});
	lesson.questions.push(questionId);
	
	const updateLessonInfo = await lessonCollection.updateOne(
		{_id: convertedLesson},
		{$set: lesson}
	);
	if (updateLessonInfo.modifiedCount === 0) throw `Could not add question (lesson)`;
	
	return questionId;
	
}

const addReply = async (questionId, reply) => {
	// this function adds a reply to a question on a lesson
	validateDBID(questionId);
	validateTextInput(reply);
	
	const questionCollection = await questions();
	const convertedQuestion = new ObjectId(questionid);
	
	let question = await questionCollection.findOne({_id: convertedQuestion});
	question.replies.push(reply);
	
	const updateQuestionInfo = await questionCollection.updateOne(
		{_id: convertedQuestion},
		{$set: question}
	);
	if (updateQuestionInfo.modifiedCount === 0) throw `Could not add reply`;
	
	return {replyAdded: true};
}

const getAllLessons = async () => {
	const lessonCollection = await lessons();
	const lessonList = await lessonCollection.find({}).toArray();
	
	return lessonList;
}

const getSomeLessons = async (num) => {
	if (!num) throw `Must provide number of lessons to return`;
	if (typeof num != 'number') throw `num must be a number`;
	if (num < 1) throw `Okay so that won't return anything`;
	
	const lessonCollection = await lessons();
	const lessonList = await lessonCollection.find({}).toArray();
	
	let formattedLessons = [];
	
	let limit = Math.min(num, lessonList.length);
	
	for (let i=0; i<limit; i++) {
		console.log(lessonList[i]);
		formattedLessons.push({id: lessonList[i]._id.toString(), name: lessonList[i].name});
	}
	
	return formattedLessons;
}

const getAuthorId = async (lessonId) => {
	validateDBID(lessonId);
	
	const lessonCollection = await lessons();
	const id = new ObjectId(lessonId);
	const lesson = await lessonCollection.findOne({_id: id});
	if (lesson === null) throw `Lesson not found`;
	
	return lesson.authorId;
	
}

module.exports = {
	createLesson,
	getLesson,
	getMyLessons,
	addQuestion,
	addReply,
	getAllLessons,
	getSomeLessons,
	getAuthorId
}