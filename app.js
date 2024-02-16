import express from 'express';
import { engine } from 'express-handlebars';
import 'dotenv/config';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import __dirname, { MONGO_URI } from './src/utils.js';
const app = express();
const PORT = process.env.PORT || 4000;


const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export const socketServer = new Server(httpServer);
// Helper function to compare two strings
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/', (req, res) => { res.redirect('/home') });

app.get('/home', (req, res) => {
    res.render('home');
});

app.use('/products', productsViewRouter);
app.get('/chat', (req, res) => {
    res.render('chat');
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);



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