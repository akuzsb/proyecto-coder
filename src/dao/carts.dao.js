import cartsSchema from "../schemas/carts.schema.js";

class CartsDAO {
    
        static async getAll() {
            return await cartsSchema.find();
        }
    
        static async getById(id) {
            return await cartsSchema.find({ _id: id })
        }

        static async getByIdPopulate(id) {
            return await cartsSchema.find({ _id: id }).populate('products.product').lean();
        }
    
        static async addCart(cart) {
            return await cartsSchema.create(cart);
        }
    
        static async updateCart(id, cart) {
            return await cartsSchema.findByIdAndUpdate(id, cart, { new: true, runValidators: true});
        }
    
        static async deleteCart(id) {
            return await cartsSchema.deleteOne({ _id: id });
        }
    
    }

export default CartsDAO;