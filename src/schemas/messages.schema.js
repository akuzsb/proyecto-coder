import mongoose from "mongoose";
import { Schema } from "mongoose";

const messageSchema = new Schema({
    user: String,
    message: String,
    date: { type: Date, default: Date.now }
});

export default mongoose.model('messages', messageSchema);