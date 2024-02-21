import express from 'express';
const router = express.Router();

import { getCartById, createCart, addProductToCart, deleteProductFromCart, updateCart,
    updateQuantityProductInCart, deleteAllProductsFromCart } from '../controllers/carts.controller.js';

router.get('/:cid', getCartById);
router.post('/', createCart)
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/product/:pid', deleteProductFromCart);
router.put('/:cid', updateCart);
router.put('/:cid/product/:pid', updateQuantityProductInCart);
router.delete('/:cid', deleteAllProductsFromCart)

export default router;