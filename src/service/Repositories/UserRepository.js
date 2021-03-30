const UserModel = require('../../model/User/UserModel.js');

class UserRepository {
    save(user) {
        const instance = new UserModel(user);
        return instance.save();
    }
}

module.exports = UserRepository;

