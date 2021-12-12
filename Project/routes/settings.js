const express = require('express');
const session = require('express-session');
// const data = require('../data/users')
const router = express.Router();
const studentData = require('../data/students');
const instructorData = require('../data/instructors');

router.get('/', async (req, res) => {
    if (req.session.user == 'instructor') {
        res.render('other/instructorSettings', { layout: 'main' });
    } else {
        res.render('other/studentSettings', { layout: 'studentLogin' });
    }
});

router.post('/studentDelete', async (req, res) => {
    var deletedUser;

    try {
        deletedUser = await studentData.deleteStudent(req.session.userId);
    } catch (e) {
        res.status(400).render('other/studentSettings', {
            layout: 'studentLogin',
            StudentError: e,
        });
        return;
    }

    if (deletedUser) {
        req.session.destroy();
        res.redirect('/');
    } else {
        res.json('error');
    }
});

router.post('/instructorDelete', async (req, res) => {
    var deletedUser;

    try {
        deletedUser = await instructorData.deleteInstructor(req.session.userId);
    } catch (e) {
        res.status(400).render('other/instructorSettings', {
            layout: 'mainLogin',
            InstructorError: e,
        });
        return;
    }

    if (deletedUser) {
        req.session.destroy();
        res.redirect('/');
    } else {
        res.json('error');
    }
});

router.post('/studentUpdate', async (req, res) => {
    const { studentFirstName, studentLastName, studentEmail, studentUsername, studentPassword } =
        req.body;

    if (
        studentUsername == ' '.repeat(studentUsername.length) ||
        studentPassword == ' '.repeat(studentPassword.length) ||
        studentFirstName == ' '.repeat(studentFirstName.length) ||
        studentLastName == ' '.repeat(studentLastName.length) ||
        studentEmail == ' '.repeat(studentEmail.length)
    ) {
        res.status(400).render('other/studentSettings', {
            layout: 'studentLogin',
            StudentError: 'Form element cannot be only spaces',
        });
        return;
    }

    if (!studentUsername || !studentPassword) {
        // res.render('other/login')
        res.status(400).render('other/studentSettings', {
            layout: 'studentLogin',
            StudentError: 'Missing username or password',
        });
        return;
    }

    if (studentUsername == ' '.repeat(studentUsername.length)) {
        res.status(400).render('other/studentSettings', {
            layout: 'studentLogin',
            StudentError: 'Username cannot be only spaces',
        });
        return;
    }

    if (studentUsername.length < 4) {
        res.status(400).render('other/studentSettings', {
            layout: 'studentLogin',
            StudentError: 'Username must be at least 4 letters long',
        });
        return;
    }

    if (/^[a-zA-Z0-9]*$/.test(studentUsername) == false) {
        res.status(400).render('other/studentSettings', {
            layout: 'studentLogin',
            StudentError: 'Username should be alphanumeric',
        });
        return;
    }

    if (studentPassword.length < 6) {
        res.status(400).render('other/studentSettings', {
            layout: 'studentLogin',
            StudentError: 'Password must be at least 6 letters long',
        });
        return;
    }

    if (studentPassword.includes(' ')) {
        res.status(400).render('other/studentSettings', {
            layout: 'studentLogin',
            StudentError: 'Password cannot have a space',
        });
        return;
    }

    var updatedUser;

    try {
        updatedUser = await studentData.updateStudent(
            req.session.userId,
            studentFirstName, 
            studentLastName, 
            studentEmail, 
            studentUsername, 
            studentPassword,
        );
    } catch (e) {
        res.status(400).render('other/studentSettings', { layout: 'studentLogin', StudentError: e });
        return;
    }

    if (updatedUser) {
        req.session.destroy();
        res.redirect('/login');
    } else {
        res.json('error');
    }
});

router.post('/instructorUpdate', async (req, res) => {
    const {
        instructorFirstName,
        instructorLastName,
        instructorEmail,
        instructorUsername,
        instructorPassword,
    } = req.body;
    //DO ERROR CHECKING

    if (
        !instructorUsername ||
        !instructorPassword ||
        !instructorFirstName ||
        !instructorLastName ||
        !instructorEmail
    ) {
        res.status(400).render('other/instructorSettings', {
            layout: 'mainLogin',
            InstructorError: 'Missing form element',
        });
        return;
    }

    if (
        instructorUsername == ' '.repeat(instructorUsername.length) ||
        instructorPassword == ' '.repeat(instructorPassword.length) ||
        instructorFirstName == ' '.repeat(instructorFirstName.length) ||
        instructorLastName == ' '.repeat(instructorLastName.length) ||
        instructorEmail == ' '.repeat(instructorEmail.length)
    ) {
        res.status(400).render('other/instructorSettings', {
            layout: 'mainLogin',
            InstructorError: 'Form element cannot be only spaces',
        });
        return;
    }

    if (!instructorUsername || !instructorPassword) {
        // res.render('other/login')
        res.status(400).render('other/instructorSettings', {
            layout: 'mainLogin',
            InstructorError: 'Missing username or password',
        });
        return;
    }

    if (instructorUsername == ' '.repeat(instructorUsername.length)) {
        res.status(400).render('other/instructorSettings', {
            layout: 'mainLogin',
            InstructorError: 'Username cannot be only spaces',
        });
        return;
    }

    if (instructorUsername.length < 4) {
        res.status(400).render('other/instructorSettings', {
            layout: 'mainLogin',
            InstructorError: 'Username must be at least 4 letters long',
        });
        return;
    }

    if (/^[a-zA-Z0-9]*$/.test(instructorUsername) == false) {
        res.status(400).render('other/instructorSettings', {
            layout: 'mainLogin',
            InstructorError: 'Username should be alphanumeric',
        });
        return;
    }

    if (instructorPassword.length < 6) {
        res.status(400).render('other/instructorSettings', {
            layout: 'mainLogin',
            InstructorError: 'Password must be at least 6 letters long',
        });
        return;
    }

    if (instructorPassword.includes(' ')) {
        res.status(400).render('other/instructorSettings', {
            layout: 'mainLogin',
            InstructorError: 'Password cannot have a space',
        });
        return;
    }

    var updatedUser;

    try {
        updatedUser = await instructorData.updateInstructor(
            req.session.userId,
            instructorFirstName,
            instructorLastName,
            instructorEmail,
            instructorUsername,
            instructorPassword,
        );
    } catch (e) {
        res.status(400).render('other/instructorSettings', { layout: 'main', InstructorError: e });
        return;
    }

    if (updatedUser) {
        req.session.destroy();
        res.redirect('/login');
    } else {
        res.json('error');
    }
});

module.exports = router;
