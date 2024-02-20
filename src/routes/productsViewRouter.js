import { Router } from 'express';
import ProductsDAO from '../dao/products.dao.js';

const router = Router();

router.get('/', async (req, res) => {
    let { limit, order, page } = req.query;
    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 8;
    try {
        const products = await ProductsDAO.getAllPaginated({limit, order, page});
        products.prevLink = products.hasPrevPage ? `/products?limit=${limit}&order=${order}&page=${products.prevPage}` : null;
        products.nextLink = products.hasNextPage ? `/products?limit=${limit}&order=${order}&page=${products.nextPage}` : null;
        products.isValid = (page > 0 && page <= products.totalPages);
        
        console.log(products)
        res.render("products", { products, orderBy: order});
    } catch (error) {
        console.log(error)
        res.render('error', { message: 'Hubo un error al obtener los productos' });
    }
});

router.get('/agregar', (req, res) => {
    res.render('addProduct');
});

router.get('/:id/editar', async (req, res) => {
    let { id } = req.params;
    try {
        let [product] = await ProductsDAO.getById(id);
        if (!product){
            return res.render('error', { message: 'Producto no encontrado' });
        }
        console.log(product)
        res.render("editProduct", { product });
    } catch (error) {
        console.log(error)
        res.render('error', { message: 'Hubo un error al obtener el producto' });
    }
});

router.get('/:id', async (req, res) => {
    let { id } = req.params;
    try {
        let [product] = await ProductsDAO.getById(id);
        if (!product){
            return res.render('error', { message: 'Producto no encontrado' });
        }
        res.render("product", { product });
    } catch (error) {
        console.log(error)
        res.render('error', { message: 'Hubo un error al obtener el producto' });
    }
});


export default router;