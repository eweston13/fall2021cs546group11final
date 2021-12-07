const mongoCollections = require('../config/mongoCollections');
const grades = mongoCollections.grades;
const quizzes = mongoCollections.quizzes;
const students = mongoCollections.students;

const ObjectId = require('mongodb').ObjectId;

function checkId (id) {
	if (!id) throw `No ID provided`;
	if (typeof id != 'string') throw `ID's must be 24-character alphanumeric strings`;
	if (id.length != 24) throw `ID's must be 24-character alphanumeric strings`;
	for (let i=0; i<id.length; i++) {
		let A = id.charCodeAt(i);
		if (A<48 || (A>57 && A<97) || A>122) throw `ID must consist of numbers and lowercase letters`;
	}
}

module.exports = {

//--------------CREATE GRADES----------------//

    async createGrades(studentName,quizName,grade)
    {
        
    },
    
//-------------RETRIEVE GRADES---------------//
    
    async getGrades(id) {
    	// get grades for student with ID id
    	const studentCollection = await students();
    	const studentId = new ObjectId(id);
    	
    	const student = await studentCollection.findOne({_id: studentId});
    	
    	if (student === null) throw `Couldn't find student ${id}`;
    	
    	return student.quizzesCompleted;
    	
    }

    async editGrades(id, grade)
    {

    },

    async removeGrades()
    {
        
    }
}