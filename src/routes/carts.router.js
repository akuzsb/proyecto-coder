import express from 'express';
const router = express.Router();

import { getCartById, createCart, addProductToCart } from '../controllers/carts.controller.js';

router.get('/:cid', getCartById);
router.post('/', createCart)
router.post('/:cid/product/:pid', addProductToCart);

export default router;