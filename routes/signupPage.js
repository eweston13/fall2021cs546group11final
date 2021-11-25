const express = require('express');
const session = require('express-session');
// const data = require('../data/users')
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('other/signup', {layout: 'mainLogin'});
  });


module.exports = router;