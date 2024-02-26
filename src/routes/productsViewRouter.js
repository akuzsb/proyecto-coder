import { Router } from 'express';
import ProductsDAO from '../dao/products.dao.js';
import { checkLogin } from '../middlewares/checkLogin.js';
const router = Router();

router.get('/', checkLogin, async (req, res) => {
    let { limit, order, page, query } = req.query;
    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 8;
    try {
        const products = await ProductsDAO.getAllPaginated({ limit, order, page, query });
        products.prevLink = products.hasPrevPage ? `/products?limit=${limit}&order=${order}&page=${products.prevPage}&query=${query}` : null;
        products.nextLink = products.hasNextPage ? `/products?limit=${limit}&order=${order}&page=${products.nextPage}&query=${query}` : null;
        products.isValid = (page > 0 && page <= products.totalPages);
        res.render("products", { products, orderBy: order });
    } catch (error) {
        console.log(error)
        res.render('error', { message: 'Hubo un error al obtener los productos' });
    }
});

router.get('/agregar', checkLogin, (req, res) => {
    res.render('addProduct');
});

router.get('/:id/editar', checkLogin, async (req, res) => {
    let { id } = req.params;
    try {
        let [product] = await ProductsDAO.getById(id);
        if (!product) {
            return res.render('error', { message: 'Producto no encontrado' });
        }
        res.render("editProduct", { product });
    } catch (error) {
        console.log(error)
        res.render('error', { message: 'Hubo un error al obtener el producto' });
    }
});

router.get('/:id', checkLogin, async (req, res) => {
    let { id } = req.params;
    try {
        let [product] = await ProductsDAO.getById(id);
        if (!product) {
            return res.render('error', { message: 'Producto no encontrado' });
        }
        res.render("product", { product });
    } catch (error) {
        console.log(error)
        res.render('error', { message: 'Hubo un error al obtener el producto' });
    }
});


export default router;