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