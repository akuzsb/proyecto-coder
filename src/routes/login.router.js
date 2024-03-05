import express from 'express';
const router = express.Router();
import passport from 'passport';

import { login, loginGithub } from '../controllers/login.controllers.js';


// router.post('/login', login);
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/users/failregister', failureMessage: true }), (req, res) => {
	res.send({ message: 'Usuario creado', status: 'success' });
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/users/failregister', failureMessage: true }), login);

router.get('/failregister', (req, res) => {
	res.status(400).send({ message: req.session.messages.pop(), status: 'error' });
});
router.get('/failgithub', (req, res) => {
	res.render('error', { message: req.session.messages.pop(), status: 'error' });
});
// /api/users/login/github
router.get('/login/github', passport.authenticate('github', { scope: ['user:email'] }));

// /api/users/githubcallback
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/api/users/failgithub', failureMessage: true }),loginGithub)

export default router;