import MessagesDAO from "../dao/messagesDao.js";

class ChatController {
    static async getMessages(req, res) {
        const messages = await MessagesDAO.getMessages();
        return messages;
    }

    static async addMessage(req, res) {
        const message = req.body;
        const newMessage = await MessagesDAO.addMessage(message);
        res.json(newMessage);
    }
}

export default ChatController;
