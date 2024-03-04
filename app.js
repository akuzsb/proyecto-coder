import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import 'dotenv/config';
import __dirname, { MONGO_URI } from './src/utils.js';
const app = express();
const PORT = process.env.PORT || 4000;
import initializePassport from './src/config/passport.config.js';


const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export const socketServer = new Server(httpServer);
const isEqual = (str1, str2) => {
    return str1 === str2;
};

app.engine('handlebars', engine({
    helpers: {
        isEqual
    }
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static('public'));


import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';
import productsViewRouter from './src/routes/productsViewRouter.js';
import cartsViewRouter from './src/routes/cartsViewRouter.js';
import loginViewRouter from './src/routes/loginViewRouter.js';
import loginRouter from './src/routes/login.router.js';
import { checkLogin } from './src/middlewares/checkLogin.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    secret: 'secretMongo',
    resave: true,
    saveUninitialized: true,
    ttl: 10 * 24 * 60 * 60
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


let connected = false;
try {
    await mongoose.connect(MONGO_URI)
    console.log('Database connected');
    connected = true;
} catch (error) {
    console.log('Error connecting to the database');
    console.log(error);
}

// primero valido si la base esta conectada, si no lo esta redirecciono todo a error
app.use((req, res, next) => {
    if (connected) {
        next();
    } else {
        res.render('error', { message: 'Error connecting to the database' })
    }
});

app.get('/', (req, res) => {
    if (req.session.user) {
        res.render('home', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

app.use('/login', loginViewRouter);
app.use('/products', productsViewRouter);
app.use('/cart', cartsViewRouter);
app.get('/chat', checkLogin, (req, res) => {
    res.render('chat');
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', loginRouter);

import MessagesDAO from './src/dao/messagesDao.js';

socketServer.on('connection', async (socket) => {

    let messages = await MessagesDAO.getMessages();
    socket.emit('messages', messages);

    socket.on('new-message', async (data) => {
        await MessagesDAO.addMessage(data);
        messages = await MessagesDAO.getMessages();
        socketServer.emit('messages', messages);
    });

});

app.use((req, res) => {
    res.status(404).send('404 - Not Found');
});
app.disable('x-powered-by');