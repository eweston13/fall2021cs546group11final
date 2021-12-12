const express = require('express');
const session = require('express-session');

const router = express.Router();

router.get('/', async (req, res) => {
	if (!req.session.user) res.redirect('/');
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;