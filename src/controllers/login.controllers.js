import UsersDAO from '../dao/usersDao.js';
import {encryptPassword, comparePassword} from '../utils/encrypt.utils.js';

export const login = async (req, res) => {
    const { user } = req.session.passport;
    let userLogged = await UsersDAO.getUserById(user);
    if (!userLogged) {
        return res.status(400).send({
            message: 'Usuario no encontrado',
            status: 'error'
        });
    }

    req.session.user = userLogged;

    res.send({
        'message': 'Usuario logueado',
        'status': 'success',
    })
    
}

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send({
                message: 'Error al cerrar sesión',
                status: 'error'
            });
        } else {
            res.send({
                message: 'Sesión cerrada',
                status: 'success'
            });
        }
    });
}

export const register = async (req, res) => {
    let { first_name, last_name, email, password, age } = req.body;
    if (!first_name || !last_name || !email || !password || !age) {
        return res.status(400).send({
            message: 'Todos los campos son requeridos',
            status: 'error'
        });
    }
    try{
        let user = await UsersDAO.getUserByEmail(email);
        if (user) {
            return res.status(400).send({
                message: 'El email ya está registrado',
                status: 'error',
                input: 'email'
            });
        }

        password = await encryptPassword(password);
        
        user = await UsersDAO.addUser({ first_name, last_name, email, password, age });
        res.send({
            message: 'Usuario registrado',
            status: 'success'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error al registrar el usuario',
            status: 'error'
        });
    }
}

export const loginGithub = (req, res) => {
    const { first_name, last_name, email, age, role, _id } = req.user;
    req.session.user = { first_name, last_name, email, age, role, _id };
    res.redirect('/');
}