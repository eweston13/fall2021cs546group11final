const loginPage = require('./loginPage');
const signupPage = require('./signupPage');
const homePage = require('./homePage');
const studenthomePage = require('./studenthome');
const lessonPage = require('./lessons');
const quizPage = require('./quizzes');
const quizEditPostPage = require('./quizEditPost');
const signOut = require('./signout');
const settingsPage = require('./settings');

// const redirectHome = (req, res, next) => {
  
//  // console.log(req.originalUrl)

//   if(req.session.username){
//     if(req.originalUrl == '/home'){
//       return next()
//     }else{
//       return res.redirect("/home");
//     }
//   }else{
//     return res.redirect('/login');
//   }
//   next()

// }

// const redirectLogin = (req, res, next) => {
   
//    if(req.session.username){
//      if(req.originalUrl == '/home'){
//        return next()
//      }else{
//        return res.redirect("/home");
//      }
//    }else{
//      return next()
//    }
//    next()
//  }
 
const constructorMethod = (app) => {
    app.use('/login', loginPage);
    app.use('/signup', signupPage);
    app.use('/lesson', lessonPage);
    app.use('/home', homePage);
    app.use('/studenthome', studenthomePage);
    app.use('/quiz', quizPage);
    app.use('/quizEditPost', quizEditPostPage);
	app.use('/signout', signOut)
    app.use('/settings', settingsPage)
  
    app.use('*', (req, res) => {
      res.redirect('/login')
    })
  };
  
  module.exports = constructorMethod;