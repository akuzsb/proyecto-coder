import mongoose from "mongoose";
import { Schema } from "mongoose";

const usersSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'user'
    }
});

export default mongoose.model('users', usersSchema);