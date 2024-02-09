import messagesSchema from "../schemas/messages.schema.js";

class MessagesDAO {
    
        static async getMessages() {
            return await messagesSchema.find().lean();
        }
    
        static async addMessage(message) {
            return await messagesSchema.create(message);
        }
    
    }

export default MessagesDAO;