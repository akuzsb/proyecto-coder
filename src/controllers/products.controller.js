import { ProductManager } from '../ProductManager.js'

const productManager = new ProductManager('./src/products.json');

export const getProducts = async (req, res) => {
    let { limit } = req.query;
    const products = await productManager.getProducts();
    if (limit) {
        products.splice(limit);
    }
    res.json(products);
}

export const getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.getProductById(pid);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createProduct = async (req, res) => {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: 'Faltan datos para crear un producto' });
    }
    status = status ?? true;
    thumbnails = thumbnails ?? [];

    try {
        let newProduct = await productManager.addProduct({ title, description, code, price, status, stock, category, thumbnails });
        res.json({ message: 'Product created successfully.', id: newProduct.id });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        await productManager.updateProduct({ id: pid, product: req.body});
        res.json({ message: 'Product updated successfully.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        await productManager.deleteProduct(pid);
        res.json({ message: 'Product deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}