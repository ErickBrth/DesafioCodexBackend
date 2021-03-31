const User = require("../model/User/User.js");
const UserRepository = require('../service/Repositories/UserRepository.js');
const passwordHelper = require('../util/helpers/passwordHelper.js');

const repository = new UserRepository();
const { UserSerializer } = require('../Serializer');

module.exports = {
    createUser: async (req, res, next) => {
        const {name, email, password} = req.body;
        const passwordHash = await passwordHelper.hashPassword(password);

        try {
            const user = new User(name, email, passwordHash);
            const result = await repository.save(user);

            res.status(201);
            const serializer = new UserSerializer(res.getHeader('Content-Type'));
            res.send(serializer.serialize(result.toObject()));

        } catch (error) {
            next(error);
        }
    }
};