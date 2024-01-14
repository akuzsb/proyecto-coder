import express from 'express';
const app = express();

import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => { res.send('Hello World!') });

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(8080, () => {
    console.log('App corriendo en el puerto 8080 http://localhost:8080');
});