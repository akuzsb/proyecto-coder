import { Router } from 'express';
import ProductsDAO from '../dao/products.dao.js';

const router = Router();

router.get('/', async (req, res) => {
    let { limit } = req.query;
    try {
        let products = await ProductsDAO.getAll(limit);
        res.render("products", { products });
    } catch (error) {
        console.log(error)
        res.render('error', { message: 'Hubo un error al obtener los productos' });
    }
});

router.get('/agregar', (req, res) => {
    res.render('addProduct');
});

router.get('/:id', async (req, res) => {
    let { id } = req.params;
    try {
        let [product] = await ProductsDAO.getById(id);
        if (!product){
            return res.render('error', { message: 'Producto no encontrado' });
        }
        console.log(product);
        res.render("product", { product });
    } catch (error) {
        console.log(error)
        res.render('error', { message: 'Hubo un error al obtener el producto' });
    }
});


export default router;