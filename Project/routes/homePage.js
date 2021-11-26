const express = require('express');
const session = require('express-session');
// const data = require('../data/users')
const studentData = require('../data/students')
const instructorData = require('../data/instructors')

const router = express.Router();

router.get('/', async (req, res) => {
    res.render('other/home')
})




module.exports = router;