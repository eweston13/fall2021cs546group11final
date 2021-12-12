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
	try {
		validateTextInput(name);
		validateDBID(author);
		validateTextInput(body);
		validateTags(tags);
	} catch (e) {
		throw (e);
	}
	
	const lessonCollection = await lessons();
	
	let newLesson = {
		name: name,
		authorId: author, // this is a simple string, not object id
		body: body,
		tags: tags,
		questions: [] // i think this should be an array
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

const updateLesson = async (id, name, body, tags, replies) => {
	try {
		validateTextInput(name);
		validateDBID(id);
		validateTextInput(body);
		tags.forEach(validateTextInput);
		if (replies && replies.length > 1) replies.forEach(validateTextInput);
	} catch (e) {
		throw e;
	}
	
	const lessonCollection = await lessons();
	const lessonId = new ObjectId(id);
	let lesson = await lessonCollection.findOne({_id: lessonId});
	
	if (lesson.name != name || lesson.body != body.substring(3, body.length - 4) || lesson.tags != tags) {
		lesson.name = name;
		lesson.body = body.substring(3, body.length - 4);
		lesson.tags = tags;
	
		const updateInfo = await lessonCollection.updateOne(
			{_id: lessonId},
			{$set: lesson}
		);
		if (updateInfo.modifiedCount === 0) console.log(`Could not update lesson`);
	}
	
	// add replies to questions
	
	const questionCollection = await questions();
	
	for (let i=0; i<lesson.questions.length; i++) {
		let questionId = new ObjectId(lesson.questions[i]);
		let question = await questionCollection.findOne({_id: questionId});
		if (question.reply != replies[i]) {
			question.reply = replies[i];
		
			let updateQuestion = await questionCollection.updateOne(
				{_id: questionId},
				{$set: question}
			);
			if (updateQuestion.modifiedCount === 0) console.log("couldn't update");
		}
	}
	
	return true;
}

const getLesson = async (id) => {
	// this function gets a specific lesson object with ID of id
	// validate first
	try {
		validateDBID(id);
	} catch (e) {
		throw e;
	}
	
	const lessonCollection = await lessons();
	let convertedId = new ObjectId(id);
	
	const lesson = await lessonCollection.findOne({_id: convertedId});
	
	if (lesson === null) throw `Could not retrieve lesson info`;
	return lesson;
}

const getMyLessons = async (id) => {
	// this function gets all lessons created by the instructor with the ID of id
	// validate authorId
	try {
		validateDBID(id);
	} catch (e) {
		throw e;
	}
	
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
		
		lessonList.push({id: lesson._id.toString(), name: lesson.name});
	}
	
	if (lessonList.length === 0) return [];
	return lessonList;
}

const addQuestion = async (lessonId, studentId, question) => {
	// this function adds a question to a lesson
	try {
		validateDBID(lessonId);
		validateDBID(studentId);
		validateTextInput(question);
	} catch (e) {
		throw e;
	}
	
	const questionCollection = await questions();
	const lessonCollection = await lessons();
	const studentCollection = await students();
	
	let newQuestion = {
		question: question,
		reply: ''
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

const getQuestion = async (id) => {
	try {
		validateDBID(id);
	} catch (e) {
		throw e;
	}
	
	const questionId = new ObjectId(id);
	const questionCollection = await questions();
	
	const question = await questionCollection.findOne({_id: questionId});
	if (question === null) throw `Could not find question`;
	
	return question;
}

const addReply = async (questionId, reply) => {
	// this function adds a reply to a question on a lesson
	try {
		validateDBID(questionId);
		validateTextInput(reply);
	} catch (e) {
		throw e;
	}
	
	const questionCollection = await questions();
	const convertedQuestion = new ObjectId(questionid);
	
	let question = await questionCollection.findOne({_id: convertedQuestion});
	question.reply(reply);
	
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
	
	let list = [];
	for (let i=0; i<lessonList.length; i++) {
		list.push({
			id: lessonList[i]._id.toString(),
			name: lessonList[i].name,
			body: lessonList[i].body,
			tags: lessonList[i].tags,
			questions: lessonList[i].questions
		});
	}
	
	return list;
}

const getLessonsByTag = async (tag) => {
	try {
		validateTextInput(tag);
	} catch (e) {
		throw e;
	}
	const lessonList = await getAllLessons();
	let results = [];
	
	for (let i=0; i<lessonList.length; i++) {
		for (let j=0; j<lessonList[i].tags.length; j++) {
			if (lessonList[i].tags[j] == tag) results.push(lessonList[i]);
		}
	}
	
	return results;
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
		formattedLessons.push({id: lessonList[i]._id.toString(), name: lessonList[i].name});
	}
	
	return formattedLessons;
}

const getAuthorId = async (lessonId) => {
	try {
		validateDBID(lessonId);
	} catch (e) {
		throw e;
	}
	
	const lessonCollection = await lessons();
	const id = new ObjectId(lessonId);
	const lesson = await lessonCollection.findOne({_id: id});
	if (lesson === null) throw `Lesson not found`;
	
	return lesson.authorId;
	
}

module.exports = {
	createLesson,
	updateLesson,
	getLesson,
	getMyLessons,
	addQuestion,
	getQuestion,
	addReply,
	getAllLessons,
	getLessonsByTag,
	getSomeLessons,
	getAuthorId
}