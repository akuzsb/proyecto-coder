import express from 'express';
const router = express.Router();

import upload from "../utils/upload.middleware.js";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js';

router.get('/', getProducts);
router.get('/:pid', getProductById);
router.post('/', upload.single('image'), createProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);

export default router;