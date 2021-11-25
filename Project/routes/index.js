const loginPage = require('./loginPage')
const signupPage = require('./signupPage')

const constructorMethod = (app) => {
    app.use('/login', loginPage);
    app.use('/signup', signupPage);

  
    app.use('*', (req, res) => {
      res.redirect('/login');
    });
  };
  
  module.exports = constructorMethod;