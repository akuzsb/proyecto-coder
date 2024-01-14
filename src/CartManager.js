import fs from 'node:fs/promises';

export class CartManager {
    #carts = [];
    #id = 0;
    #path = '';

    constructor(path) {
        if (!path) throw new Error('Path es requerido');
        this.#path = path;
    }

    async getCarts() {
        let carts = await fs.readFile(this.#path, 'utf-8');
        this.#carts = carts ? JSON.parse(carts) : [];
        return this.#carts;
    }

    getCartById = async (id) => {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id == id);
        return cart;
    }

    async getIdCart() {
        let carts = await this.getCarts();
        if (!carts.length) return 0;
        this.#id = Math.max(...carts.map(c => c.id));
        return this.#id;
    }

    async addCart(cart) {
        this.#id = await this.getIdCart() + 1;
        let carts = await this.getCarts();
        carts.push({
            id: this.#id,
            ...cart
        });
        await this.saveCarts(carts);
        return ({ ...cart, id: this.#id })
    }

    async saveCarts(carts) {
        await fs.writeFile(this.#path, JSON.stringify(carts));
    }

    async deleteCart(id) {
        let carts = await this.getCarts();
        carts = carts.filter(c => c.id !== id);
        await this.saveCarts(carts);
    }

    async updateCart({ id, cart }) {
        let carts = await this.getCarts();
        const index = carts.findIndex(c => c.id == id);
        carts[index] = {
            ...carts[index],
            ...cart
        };
        await this.saveCarts(carts);
    }
}