const express = require('express');
const session = require('express-session');
// const data = require('../data/users')
const studentData = require('../data/students')
const instructorData = require('../data/instructors')

const router = express.Router();

router.get('/', async (req, res) => {
    res.render('other/login', {layout: 'mainLogin'});
  });

router.post('/studentlogin', async (req, res) => {

  const {username, password} = req.body
  // console.log("username:", username)
  // console.log("password:", password)
  if(!username || !password){
    // res.render('other/login')
    res.status(400).render("other/login", {layout: 'mainLogin', StudentError: "Missing username or password"})
    return
  }

  if(username == ' '.repeat(username.length)){
    res.status(400).render('other/login', {layout: 'mainLogin', StudentError: "Username cannot be only spaces"})
    return
  } 

  if(username.length < 4){
    res.status(400).render('other/login', {layout: 'mainLogin', StudentError: "Username must be at least 4 letters long"})
    return
  }  

  if(/^[a-zA-Z0-9]*$/.test(username) == false){
    res.status(400).render('other/login', {layout: 'mainLogin', StudentError: "Username should be alphanumeric"})
    return 
  }  

  if(password.length < 6){
    res.status(400).render('other/login', {layout: 'mainLogin', StudentError: "Password must be at least 6 letters long"})
    return
  }

  if(password.includes(' ')){
    res.status(400).render('other/login', {layout: 'mainLogin', StudentError: "Password cannot have a space"})
    return
  }    
  
  
  var theUser;  

  //DO ERROR CHECKING


  try{
  theUser = await studentData.checkStudent(username, password)
  }catch (e){
    console.log(e)
    res.status(400).render('other/login', {layout: 'mainLogin', StudentError: e})
    return
  }

  if(theUser.authenticated == true){
    //console.log("here")
    req.session.username = username 
    res.redirect('/home')
  }else{
    res.json('error')
  }

});

router.post('/instructorlogin', async (req, res) => {

  const {instructorUsername, instructorPassword} = req.body

  //DO ERROR CHECKING
  if(!instructorUsername || !instructorPassword){
    // res.render('other/login')
    res.status(400).render("other/login", {layout: 'mainLogin', InstructorError: "Missing username or password"})
    return
  }

  if(instructorUsername == ' '.repeat(instructorUsername.length)){
    res.status(400).render('other/login', {layout: 'mainLogin', InstructorError: "Username cannot be only spaces"})
    return
  } 

  if(instructorUsername.length < 4){
    res.status(400).render('other/login', {layout: 'mainLogin', InstructorError: "Username must be at least 4 letters long"})
    return
  }  

  if(/^[a-zA-Z0-9]*$/.test(instructorUsername) == false){
    res.status(400).render('other/login', {layout: 'mainLogin', InstructorError: "Username should be alphanumeric"})
    return 
  }  

  if(instructorPassword.length < 6){
    res.status(400).render('other/login', {layout: 'mainLogin', InstructorError: "Password must be at least 6 letters long"})
    return
  }

  if(instructorPassword.includes(' ')){
    res.status(400).render('other/login', {layout: 'mainLogin', InstructorError: "Password cannot have a space"})
    return
  }  


  var theUser;  

  try{
  theUser = await instructorData.checkInstructor(instructorUsername, instructorPassword)
  }catch (e){
    console.log(e)
    res.status(400).render('other/login', {layout: 'mainLogin', InstructorError: e})
    return
  }

  if(theUser.authenticated == true){
    //console.log("here")
    req.session.username = instructorUsername 
    res.redirect('/home')
  }else{
    res.json('error')
  }

});




module.exports = router;