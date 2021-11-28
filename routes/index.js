const loginPage = require('./loginPage')
const signupPage = require('./signupPage')
const quizRoutes = require("./quizzes");

const constructorMethod = (app) => {
    
  app.use('/login', loginPage);
  app.use('/signup', signupPage);
  app.use('/quizzes',quizRoutes);
  
  app.use('*', (req, res) => {
    res.redirect('/login');
  });
};
  
  module.exports = constructorMethod;