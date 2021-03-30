const User = require("../model/User/User.js");
const UserRepository = require('../service/Repositories/UserRepository.js');

const repository = new UserRepository();

module.exports = {
    addUser: async (req, res, next) => {
        const {name, email, password} = req.body;

        try {
            const user = new User(name, email, password);
            const result = await repository.save(user);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
};