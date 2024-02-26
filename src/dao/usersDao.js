import usersSchema from '../schemas/users.schema.js';

class UsersDAO {
    static async addUser(user) {
        const newUser = new usersSchema(user);
        return await newUser.save();
    }

    static async getUserByEmail(email) {
        return await usersSchema.findOne({ email });
    }
}

export default UsersDAO;