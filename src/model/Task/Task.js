const validator = require("../../util/helpers/validators.js");
const {InvalidArgumentError} = require("../../util/errors");
const {PriorityError} = require("../../util/errors");

class Task {
    constructor(name, priority, userId) {
        this.name = name;
        this.priority = priority;
        this.userId = userId;
    }

    static validate(name, priority) {
        if(!(priority === "alta" || priority === 'baixa')) {
            throw new PriorityError();
        }
        validator.emptyField({
            name: name,
            priority: priority
        });
    }

    static validateUpdate(name, priority) {
        if(!name && !priority) {
            throw new InvalidArgumentError("Campo name e priority estao vazios");
        }
    }
}

module.exports = Task;