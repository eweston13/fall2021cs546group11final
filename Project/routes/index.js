const loginPage = require('./loginPage');
const signupPage = require('./signupPage');
const homePage = require('./homePage');
const lessonPage = require('./lessons');

const redirectHome = (req, res, next) => {
  
 // console.log(req.originalUrl)

  if(req.session.username){
    if(req.originalUrl == '/home'){
      return next()
    }else{
      return res.redirect("/home");
    }
  }else{
    return res.redirect('/login');
  }
  next()

}

const redirectLogin = (req, res, next) => {
   
   if(req.session.username){
     if(req.originalUrl == '/home'){
       return next()
     }else{
       return res.redirect("/home");
     }
   }else{
     return next()
   }
   next()
 }
 

const constructorMethod = (app) => {
    app.use('/login', redirectLogin, loginPage);
    app.use('/signup', redirectHome, signupPage);
    app.use('/lesson', lessonPage);
    app.use('/home', redirectHome, homePage);
  
    app.use('*', redirectHome)
  };
  
  module.exports = constructorMethod;