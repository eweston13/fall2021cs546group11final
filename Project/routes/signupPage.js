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
  if(!username || !password || !firstName || !lastName || !email) {res.status(400).render("other/signup", {layout: 'mainLogin', StudentError: "Missing form element"}); return}

  if(username == ' '.repeat(username.length) || password == ' '.repeat(password.length) || firstName == ' '.repeat(firstName.length) || lastName == ' '.repeat(lastName.length) || email == ' '.repeat(email.length)){
    res.status(400).render("other/signup", {layout: 'mainLogin', StudentError: "Form element cannot be only spaces"}); 
  return
  }
  
  if(!username || !password){
    // res.render('other/login')
    res.status(400).render("other/signup", {layout: 'mainLogin', StudentError: "Missing username or password"})
    return
  }

  if(username == ' '.repeat(username.length)){
    res.status(400).render('other/signup', {layout: 'mainLogin', StudentError: "Username cannot be only spaces"})
    return
  } 

  if(username.length < 4){
    res.status(400).render('other/signup', {layout: 'mainLogin', StudentError: "Username must be at least 4 letters long"})
    return
  }  

  if(/^[a-zA-Z0-9]*$/.test(username) == false){
    res.status(400).render('other/signup', {layout: 'mainLogin', StudentError: "Username should be alphanumeric"})
    return 
  }  

  if(password.length < 6){
    res.status(400).render('other/signup', {layout: 'mainLogin', StudentError: "Password must be at least 6 letters long"})
    return
  }

  if(password.includes(' ')){
    res.status(400).render('other/signup', {layout: 'mainLogin', StudentError: "Password cannot have a space"})
    return
  }    
  

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

  if(!instructorUsername || !instructorPassword || !instructorFirstName || !instructorLastName   || !instructorEmail) {res.status(400).render("other/signup", {layout: 'mainLogin', InstructorError: "Missing form element"}); return}

  if(instructorUsername == ' '.repeat(instructorUsername.length) || instructorPassword == ' '.repeat(instructorPassword.length) || instructorFirstName == ' '.repeat(instructorFirstName.length) || instructorLastName == ' '.repeat(instructorLastName.length) || instructorEmail == ' '.repeat(instructorEmail.length)){
    res.status(400).render("other/signup", {layout: 'mainLogin', InstructorError: "Form element cannot be only spaces"}); 
  return
  }
  
  if(!instructorUsername || !instructorPassword){
    // res.render('other/login')
    res.status(400).render("other/signup", {layout: 'mainLogin', InstructorError: "Missing username or password"})
    return
  }

  if(instructorUsername == ' '.repeat(instructorUsername.length)){
    res.status(400).render('other/signup', {layout: 'mainLogin', InstructorError: "Username cannot be only spaces"})
    return
  } 

  if(instructorUsername.length < 4){
    res.status(400).render('other/signup', {layout: 'mainLogin', InstructorError: "Username must be at least 4 letters long"})
    return
  }  

  if(/^[a-zA-Z0-9]*$/.test(instructorUsername) == false){
    res.status(400).render('other/signup', {layout: 'mainLogin', InstructorError: "Username should be alphanumeric"})
    return 
  }  

  if(instructorPassword.length < 6){
    res.status(400).render('other/signup', {layout: 'mainLogin', InstructorError: "Password must be at least 6 letters long"})
    return
  }

  if(instructorPassword.includes(' ')){
    res.status(400).render('other/signup', {layout: 'mainLogin', InstructorError: "Password cannot have a space"})
    return
  }    

  var newUser

  try{
    newUser = await instructorData.addInstructor(instructorFirstName, instructorLastName, instructorEmail, instructorUsername, instructorPassword)
  }catch (e){
    res.status(400).render('other/signup', {layout: 'mainLogin', InstructorError: e})
    return
  }

  console.log(newUser.userInserted)

  if(newUser){
    res.redirect("/login");
  }else{
    res.json('error');
  }

});




module.exports = router;