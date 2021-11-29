const loginPage = require('./loginPage')
const signupPage = require('./signupPage')
const homePage = require('./homePage')

const constructorMethod = (app) => {
    app.use('/login', loginPage);
    app.use('/signup', signupPage);
    app.use('/home', homePage)
  
    app.use('*', (req, res) => {
      res.redirect('/');
    });
  };
  
  module.exports = constructorMethod;