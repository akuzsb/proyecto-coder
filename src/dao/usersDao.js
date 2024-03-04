import usersSchema from '../schemas/users.schema.js';

class UsersDAO {
    static async addUser(user) {
        const newUser = new usersSchema(user);
        return await newUser.save();
    }

    static async getUserByEmail(email) {
        return await usersSchema.findOne({ email });
    }

    static async getUserById(id) {
       return await usersSchema.findById(id, { password: 0 });
    }
}

export default UsersDAO;