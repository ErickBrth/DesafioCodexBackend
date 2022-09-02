class PriorityError extends Error {
    constructor() {
        super("A prioridade tem que ser 'alta' ou 'baixa'");
        this.name = "PriorityError";
        this.id = 6;
    }
}

module.exports = PriorityError;