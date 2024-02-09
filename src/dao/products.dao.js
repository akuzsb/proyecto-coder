import productsSchema from "../schemas/products.schema.js";

class ProductsDAO {

    static async getAll(limit = null) {
        if (limit) {
            return await productsSchema.find().limit(limit).lean();
        }
        return await productsSchema.find().lean();

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
