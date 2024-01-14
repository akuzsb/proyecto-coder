import { CartManager } from "../CartManager.js";

const cartManager = new CartManager('./src/carrito.json');

export const getCartById = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) return res.status(404).send({ error: 'carrito no encontrado' });
        res.json(cart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

export const createCart = async (req, res) => {
    try {
        const cart = await cartManager.addCart({ products: [] });
        res.status(201).json({ message: 'carrito creado', id: cart.id });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

export const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) return res.status(404).send({ error: 'carrito no encontrado' });

        let productInCart = cart.products.find(p => p.product == pid);

        let productNew = {
            product: pid,
            quantity: productInCart ? productInCart.quantity + 1 : 1
        }
        if (productInCart) {
            cart.products = cart.products.filter(p => p.product != pid);
        }
        await cartManager.updateCart({ id: cid, cart: { products: [...cart.products, productNew] } });

        res.send({ message: 'Producto agregado al carrito' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}