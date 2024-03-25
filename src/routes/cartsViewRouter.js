import { Router } from 'express';
import {checkLogin} from '../middlewares/checkLogin.js';
const router = Router();

import CartsDAO from '../dao/carts.dao.js'
import { getCartByIdPopulate } from '../controllers/carts.controller.js';

router.get('/', checkLogin, (req, res) => {
    res.render('error', { message: 'Es necesario id del carrito' });
});

router.get('/:cid', checkLogin, getCartByIdPopulate);

export default router;