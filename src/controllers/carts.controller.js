import { CartManager } from "../dao/CartManager.js";
import CartsDAO from '../dao/carts.dao.js'


const cartManager = new CartManager('./src/carrito.json');

export const getCartById = async (req, res) => {
    const { cid } = req.params;

    try {
        const [cart] = await CartsDAO.getByIdPopulate(cid);
        if (!cart) return res.status(404).send({ error: 'carrito no encontrado' });
        res.json(cart);
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Hubo un error al obtener el carrito' });
    }
}

export const createCart = async (req, res) => {
    try {
        // const cart = await cartManager.addCart({ products: [] });
        const cart = await CartsDAO.addCart({ products: [] });
        res.status(201).json({ message: 'carrito creado', id: cart._id });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Hubo un error al crear el carrito' });
    }
}

export const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const [cart] = await CartsDAO.getById(cid);
        if (!cart) return res.status(404).send({ error: 'carrito no encontrado' });

        const [product] = await CartsDAO.getProductById(pid);
        if (!product) return res.status(404).send({ error: 'producto no encontrado' });

        let productInCart = cart.products.find(p => p.product == pid);


        let productNew = {
            product: pid,
            quantity: productInCart ? productInCart.quantity + 1 : 1
        }
        if (productInCart) {
            cart.products = cart.products.filter(p => p.product != pid);
        }
        await CartsDAO.updateCart(cid, { products: [...cart.products, productNew] });

        res.send({ message: 'Producto agregado al carrito' });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Hubo un error al agregar el producto al carrito' });
    }
}

export const deleteProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const [cart] = await CartsDAO.getById(cid);
        if (!cart) return res.status(404).send({ error: 'carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product._id != pid);
        await CartsDAO.updateCart(cid, { products: cart.products });

        res.send({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Hubo un error al eliminar el producto del carrito' });
    }
}

export const updateCart = async (req, res) => {
    const { cid } = req.params;
    if (!req.body.products) return res.status(400).send({ error: 'Falta products' });
    try {
        const cart = await CartsDAO.updateCart(cid, req.body);
        res.json({ message: 'carrito actualizado' });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Hubo un error al actualizar el carrito' });
    }
}

export const updateQuantityProductInCart = async (req, res) => {
    const { cid, pid } = req.params;
    if (!req.body.quantity) return res.status(400).send({ error: 'Falta quantity' });
    if (isNaN(req.body.quantity)) return res.status(400).send({ error: 'quantity debe ser un número' });
    try {
        const [cart] = await CartsDAO.getById(cid);
        if (!cart) return res.status(404).send({ error: 'carrito no encontrado' });

        let productInCart = cart.products.find(p => p.product == pid);
        if (!productInCart) return res.status(404).send({ error: 'producto no encontrado en el carrito' });

        productInCart.quantity = req.body.quantity;
        cart.products = cart.products.map(p => p.product == pid ? productInCart : p);
        await CartsDAO.updateCart(cid, { products: cart.products });

        res.send({ message: 'Producto actualizado en el carrito' });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Hubo un error al actualizar el producto en el carrito' });
    }
}

export const deleteAllProductsFromCart = async (req, res) => {
    const { cid } = req.params;
    try {
        const [cart] = await CartsDAO.getById(cid);
        if (!cart) return res.status(404).send({ error: 'carrito no encontrado' });

        await CartsDAO.updateCart(cid, { products: [] });

        res.send({ message: 'Productos eliminados del carrito' });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Hubo un error al eliminar los productos del carrito' });
    }
}