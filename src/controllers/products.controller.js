import { ProductManager } from '../dao/ProductManager.js'
import ProductsDAO from '../dao/products.dao.js'

const productManager = new ProductManager('./src/products.json');

export const getProducts = async (req, res) => {
    let { limit, order, page } = req.query;
    page = page ? parseInt(page) : 1;
    try {
        const products = await ProductsDAO.getAllPaginated({limit, order, page});
        products.prevLink = products.hasPrevPage ? `/api/products?limit=${limit}&order=${order}&page=${products.prevPage}` : null;
        products.nextLink = products.hasNextPage ? `/api/products?limit=${limit}&order=${order}&page=${products.nextPage}` : null;
        products.isValid = (page > 0 && page <= products.totalPages);

        const { docs, ...rest } = products;

        res.json({
            status: 'success',
            payload: docs,
            ...rest
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Hubo un error al obtener los productos'});
    }
}

export const getProductById = async (req, res) => {
    const { pid } = req.params;
    if (!pid) {
        return res.status(400).json({ message: 'id es requerido' });
    }
    try {
        let [product] = await ProductsDAO.getById(pid);
        if (!product){
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Hubo un error al obtener el producto'});
    }
}

export const createProduct = async (req, res) => {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !category) {
        return res.status(400).json({ message: 'Faltan datos para crear un producto', data: req.body  });
    }
    status = status ?? true;
    thumbnails = thumbnails ?? [];

    let filename = req.file ? req.file.filename : null;
    if (filename) {
        thumbnails.push(filename);
    }

    try {
        let newProduct = await ProductsDAO.addProduct({ title, description, code, price, status, stock, category, thumbnails });
        res.json({ message: 'Producto creado con éxito', id: newProduct._id });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Hubo un error al crear el producto' });
    }
}

export const updateProduct = async (req, res) => {
    const { pid } = req.params;
    if (!pid) {
        return res.status(400).json({ message: 'id es requerido' });
    }
    if (!Object.keys(req.body).length) {
        return res.status(400).json({ message: 'No hay datos para actualizar' });
    }
    try {
        let [product] = await ProductsDAO.getById(pid);
        if (!product){
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        await ProductsDAO.updateProduct(pid, req.body);
        res.json({ message: 'Producto actualizado con éxito'});
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Hubo un error al actualizar el producto' });
    }
}

export const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    if (!pid) {
        return res.status(400).json({ message: 'id es requerido' });
    }
    try {
        let [product] = await ProductsDAO.getById(pid);
        if (!product){
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        await ProductsDAO.deleteProduct(pid);
        res.json({ message: 'Producto eliminado con éxito'});
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Hubo un error al eliminar el producto' });
    }
}