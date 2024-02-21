import mongoose from "mongoose";
const { Schema } = mongoose;
const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
        required: true
    }
});

export default mongoose.model('Cart', cartSchema);