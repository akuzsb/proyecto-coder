import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.render('error', { message: 'Error al cerrar sesión' });
        } 
    });
    res.redirect('/');
});

export default router;