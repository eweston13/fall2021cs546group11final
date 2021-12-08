const mongoCollections = require('../config/mongoCollections');
const grades = mongoCollections.grades;
const quizzes = mongoCollections.quizzes;
const students = mongoCollections.students;

const ObjectId = require('mongodb').ObjectId;

// validation functions
function checkId (id) {
	if (!id) throw `No ID provided`;
	if (typeof id != 'string') throw `ID's must be 24-character alphanumeric strings`;
	if (id.length != 24) throw `ID's must be 24-character alphanumeric strings`;
	for (let i=0; i<id.length; i++) {
		let A = id.charCodeAt(i);
		if (A<48 || (A>57 && A<97) || A>122) throw `ID must consist of numbers and lowercase letters`;
	}
}

// db functions

const createGrades = async (studentId, quizId, grade) => {

}

const getGrades = async (id) => {
	// get grades for student with ID id
	checkId(id);
	
    const studentCollection = await students();
    const studentId = new ObjectId(id);
    	
    const student = await studentCollection.findOne({_id: studentId});
    	
    if (student === null) throw `Couldn't find student ${id}`;
    	
    return student.quizzesCompleted;
    	
}

const editGrades = async (studentId, quizId, grade) => {

}

const removeGrades = async (studentId) => {

}

module.exports = {
	createGrades,
	getGrades,
	editGrades,
	removeGrades
}