const express = require('express');
const session = require('express-session');
// const data = require('../data/users')
const router = express.Router();
const studentData = require('../data/students')
const instructorData = require('../data/instructors')

router.get('/', async (req, res) => {
    res.render('other/signup', {layout: 'mainLogin'});
  });

router.post('/studentSignup', async (req, res) => {


  const {firstName, lastName, email, username, password} = req.body

  //DO ERROR CHECKING
  var newUser

  try{
    newUser = await studentData.addStudent(firstName, lastName, email, username, password)
  }catch (e){
    res.status(400).render('other/signup', {layout: 'mainLogin', StudentError: e })
    return
  }

  console.log(newUser.userInserted)

  if(newUser.userInserted == true){
    res.redirect("/login")
  }else{
    res.json('error')
  }

});

router.post('/instructorSignup', async (req, res) => {


  const {instructorFirstName, instructorLastName, instructorEmail, instructorUsername, instructorPassword} = req.body
  //DO ERROR CHECKING

  var newUser

  try{
    newUser = await instructorData.addInstructor(instructorFirstName, instructorLastName, instructorEmail, instructorUsername, instructorPassword)
  }catch (e){
    res.status(400).render('other/signup', {layout: 'mainLogin', InstructorError: e})
    return
  }

  console.log(newUser.userInserted)

  if(newUser.userInserted == true){
    res.redirect("/login")
  }else{
    res.json('error')
  }

});




module.exports = router;