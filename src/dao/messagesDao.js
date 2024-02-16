import messagesSchema from "../schemas/messages.schema.js";

class MessagesDAO {
    static async getMessages() {
        return await messagesSchema.find().sort({ date: -1 }).limit(30);
    }

    static async addMessage(message) {
        return await messagesSchema.create(message);
    }
}

export default MessagesDAO;