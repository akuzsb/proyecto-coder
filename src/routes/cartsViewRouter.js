import e, { Router } from 'express';
const router = Router();

import CartsDAO from '../dao/carts.dao.js'

router.get('/', (req, res) => {
    res.render('error', { message: 'Hubo un error al obtener el carrito' });
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const [cart] = await CartsDAO.getByIdPopulate(cid);
        if (!cart) return res.render('error', { message: 'carrito no encontrado' });
        cart.products = cart.products.map(p => {
            p.total = (p.product.price * p.quantity).toFixed(2);
            return p;
        });
        res.render('cart', { cart });
    } catch (error) {
        console.log(error)
        res.render('error', { message: 'Hubo un error al obtener el carrito' });
    }
});

export default router;