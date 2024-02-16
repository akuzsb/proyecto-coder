import productsSchema from "../schemas/products.schema.js";

class ProductsDAO {

    static async getAll({ limit = null, orderBy = 'title-asc' }) {
        let order = orderBy.split('-');
        let sortBy = {};
        sortBy[order[0]] = order[1] === 'asc' ? 1 : -1;
        const products = await productsSchema.find().sort(sortBy).lean();
        return {
            products,
            orderBy
        }
    }

    static async getById(id) {
        return await productsSchema.find({ _id: id }).lean();
    }

    static async addProduct(product) {
        return await productsSchema.create(product);
    }

    static async updateProduct(id, product) {
        return await productsSchema.findByIdAndUpdate(id, product, { new: true });
    }

    static async deleteProduct(id) {
        return await productsSchema.deleteOne({ _id: id });
    }

}

export default ProductsDAO;
