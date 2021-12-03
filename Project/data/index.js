const studentData = require('./students');
const instructorData = require('./instructors');
const quizData = require('./quizzes');
//const gradesData = require('./grades');

module.exports = {
  instructors: instructorData,
  students: studentData,
  quizzes: quizData,
  //grades : gradesData
};