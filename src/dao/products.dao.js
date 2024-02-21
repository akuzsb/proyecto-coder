import productsSchema from "../schemas/products.schema.js";

class ProductsDAO {

    static async getAllPaginated({ limit = 10, order = null, page = 1, query = null}) {

        let config = {
            limit,
            page,
            lean: true,
            sort: order ? { [order.split('-')[0]]: order.split('-')[1] === 'desc' ? -1 : 1 } : undefined
        };

        // la query es para buscar por categoria, si dice stock es todos los productos con stock mayor a 0
        if (query) {
            if (query === 'stock') {
                query = { stock: { $gt: 0 } };
            } else if (query == 'undefined') {
                query = {};
            } else {
                // que no sea case sensitive
                query = { category: { $regex: new RegExp(query, 'i') } };
            }
        }
        return await productsSchema.paginate(query, config);
    }

    static async getAll({ limit = 10, orderBy = null }) {
        let products = await productsSchema.find().limit(limit).sort(orderBy ? { [orderBy.split('-')[0]]: orderBy.split('-')[1] === 'desc' ? -1 : 1 } : undefined).lean();
        return { products, orderBy };
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
