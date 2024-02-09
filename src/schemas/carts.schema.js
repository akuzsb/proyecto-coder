import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: {
        type: Array,
        required: true,
    }
});

export default mongoose.model('Cart', cartSchema);