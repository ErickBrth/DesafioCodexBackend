const UserModel = require('../../model/User/UserModel.js');
const User = require("../../model/User/User.js");
const {UserNotFound} = require("../../util/errors");

module.exports = {
    save: async (user) => {
        const instance = new UserModel(user);
        const result = await instance.save();
        return result.toObject();
    },
    findByEmail: async (email) => {
        const result = await UserModel.findOne({email: email});
        if(!result)
            throw new UserNotFound();

        return new User(result.name, result.email, result.passwordHash, result._id);
    },
    findById: async (id) => {
        const result = await UserModel.findById(id);
        if(!result)
            throw new UserNotFound();

        return new User(result.name, result.email, result.passwordHash, result._id);
    }
}