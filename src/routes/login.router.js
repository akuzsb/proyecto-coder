import express from 'express';
const router = express.Router();
import passport from 'passport';

import { login, register } from '../controllers/login.controllers.js';


// router.post('/login', login);
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/users/failregister', failureMessage: true }), (req, res) => {
	res.send({ message: 'Usuario creado', status: 'success' });
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/users/failregister', failureMessage: true }), login);

router.get('/failregister', (req, res) => {
	res.status(400).send({ message: req.session.messages.pop(), status: 'error' });
});

export default router;