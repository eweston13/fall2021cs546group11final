const mongoCollections = require('../config/mongoCollections');
const grades = mongoCollections.grades;
const { ObjectId } = require('mongodb');

module.exports = {

//--------------CREATE GRADES----------------//

    async createGrades(studentName,quizName,grade)
    {

    },

    async editGrades(id,grade)
    {

    },

    async removeGrades()
    {
        
    }
}