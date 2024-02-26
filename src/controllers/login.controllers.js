import UsersDAO from '../dao/usersDao.js';

export const login = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send({
            message: 'email and password are required',
            status: 'error',
            input: 'email'
        });
    }
    
    let user = await UsersDAO.getUserByEmail(email);
    if (!user) {
        return res.status(400).send({
            message: 'Usuario no encontrado',
            status: 'error',
            input: 'email'
        });
    }
    if (user.password !== password) {
        return res.status(400).send({
            message: 'Contraseña incorrecta',
            status: 'error',
            input: 'password'
        });
    }

    const userSession = {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        role: user.role
    }
    req.session.user = userSession;

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