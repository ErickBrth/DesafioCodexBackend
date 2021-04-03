process.env.NODE_ENV = 'test';
process.env.PORT = "4000";

const chai = require('chai');
const server = require('../src/server.js');
const chai_http = require('chai-http');
const should = chai.should();
const assert = chai.assert;
const User = require('../src/model/User/User.js');
const MongoInMemory = require('mongodb-memory-server');
const dataBaseConfig = require('../src/config/database.js');
const {describe, before, it} = require("mocha");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_NO_CONTENT = 204;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_BAD_REQUEST = 400;

chai.use(chai_http);

function requestPost(url, data, callback, token = "") {
    chai.request(server)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .send(data)
        .end(callback);
}

function requestGet(url, callback, token = "") {
    chai.request(server)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .end(callback);
}

function requestPut(url, id, data, callback, token = "") {
    chai.request(server)
        .put(`${url}/${id}`)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .send(data)
        .end(callback);
}

function requestDelete(url, id, callback, token = "") {
    chai.request(server)
        .delete(`${url}/${id}`)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .end(callback);
}

const user1 = {
    "name": "Pedro",
    "email": "emailPedro@codexjr.com.br",
    "password": "12345678"
}

const user2 = {
    "name": "Conta 2",
    "email": "conta2@codexjr.com.br",
    "password": "Nova senha"
}

const validTaskAlta = {
    "name": "Task Alta",
    "priority": "alta"
}

const validTaskBaixa = {
    "name": "Task Baixa",
    "priority": "baixa"
}

let tokenUser1 = null;
let tokenUser2 = null;
let idTaskUser1 = null;
let idTaskUser2 = null;

//Criar Usuario 1
before(async () => {
    const mongoServer = new MongoInMemory.MongoMemoryServer();
    dataBaseConfig(await mongoServer.getUri());
    return chai.request(server)
        .post("/users")
        .set('Accept', 'application/json')
        .send(user1);
});

//Criar Usuario 2
before(async () => {
    const mongoServer = new MongoInMemory.MongoMemoryServer();
    dataBaseConfig(await mongoServer.getUri());
    return chai.request(server)
        .post("/users")
        .set('Accept', 'application/json')
        .send(user2);
});

//Logar Usuario 1
before(() => {
    return chai.request(server)
        .post("/users/login")
        .set('Accept', 'application/json')
        .send(user1)
        .then(response => {
            tokenUser1 = response.body.access_token;
        });
});

//Logar Usuario 2
before(() => {
    return chai.request(server)
        .post("/users/login")
        .set('Accept', 'application/json')
        .send(user2)
        .then(response => {
            tokenUser2 = response.body.access_token;
        });
});

describe('Criar tarefa', async () => {
    it('Sem token', (done) => {
        const data = {
            "name": "Nova Task",
            "priority": "alta"
        }

        function callback(error, response) {
            response.should.have.status(HTTP_CODE_UNAUTHORIZED);
            assert.equal(response.body.message, "Acesso nao autorizado");
            done();
        }

        requestPost("/tasks", data, callback);
    });

    it('Token invalido', (done) => {
        const data = {
            "name": "Nova Task",
            "priority": "alta"
        }

        function callback(error, response) {
            response.should.have.status(HTTP_CODE_UNAUTHORIZED);
            assert.equal(response.body.message, "invalid signature");
            done();
        }

        requestPost("/tasks", data, callback, tokenUser1 + "error");
    });

    it('Campo invalido', (done) => {
        const data = {
            "priority": "alta"
        }

        function callback(error, response) {
            response.should.have.status(HTTP_CODE_BAD_REQUEST);
            assert.equal(response.body.message, "O campo name eh obrigatorio");
            done();
        }

        requestPost("/tasks", data, callback, tokenUser1);
    });

    it('Prioridade Invalida', (done) => {
        const data = {
            "name": "Nova task",
            "priority": "outra"
        }

        function callback(error, response) {
            response.should.have.status(HTTP_CODE_BAD_REQUEST);
            assert.equal(response.body.message, "A prioridade tem que ser 'alta' ou 'baixa'");
            done();
        }

        requestPost("/tasks", data, callback, tokenUser1);
    });

    it('Sucesso ao adicionar', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_CREATED);
            response.body.should.have.property('_id');
            assert.equal(response.body.name, validTaskBaixa["name"]);
            assert.equal(response.body.priority, validTaskBaixa["priority"]);
            done();
        }

        requestPost("/tasks", validTaskBaixa, callback, tokenUser1);
    });
});

//Criar tarefa para usuario 1
before(() => {
    return chai.request(server)
        .post("/tasks")
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenUser1)
        .send(validTaskAlta)
        .then(response => {
            idTaskUser1 = response.body._id;
        });
});

//Criar tarefa para usuario 2
before(() => {
    return chai.request(server)
        .post("/tasks")
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenUser2)
        .send(validTaskAlta)
        .then(response => {
            idTaskUser2 = response.body._id;
        });
});

describe('Listar tarefas', async () => {
    it('Sem token', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_UNAUTHORIZED);
            assert.equal(response.body.message, "Acesso nao autorizado");
            done();
        }

        requestGet("/tasks", callback);
    });

    it('Token invalido', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_UNAUTHORIZED);
            assert.equal(response.body.message, "invalid signature");
            done();
        }

        requestGet("/tasks", callback, tokenUser1 + "error");
    });

    it('Sucesso ao listar ordenado pela prioridade alta usuario 1', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_OK);
            assert.equal(response.body.length, 2);
            assert.equal(response.body[0].name, validTaskAlta.name);
            assert.equal(response.body[1].name, validTaskBaixa.name);
            done();
        }

        requestGet("/tasks", callback, tokenUser1);
    });

    it('Sucesso ao listar ordenado pela prioridade alta usuario 2', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_OK);
            assert.equal(response.body.length, 1);
            assert.equal(response.body[0].name, validTaskAlta.name);
            done();
        }

        requestGet("/tasks", callback, tokenUser2);
    });
});

describe('Editar tarefas', async () => {
    it('Sem token', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_UNAUTHORIZED);
            assert.equal(response.body.message, "Acesso nao autorizado");
            done();
        }

        const data = {
            "name": "Task Baixa",
            "priority": "baixa"
        }

        requestPut("/task", idTaskUser1, data, callback);
    });

    it('Token invalido', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_UNAUTHORIZED);
            assert.equal(response.body.message, "invalid signature");
            done();
        }

        const data = {
            "name": "Task Baixa",
            "priority": "baixa"
        }

        requestPut("/task", idTaskUser1, data, callback, tokenUser1 + "error");
    });

    it('Campos vazios', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_BAD_REQUEST);
            assert.equal(response.body.message, "Campo name e priority estao vazios");
            done();
        }

        const data = {
            "name": "",
            "priority": ""
        }

        requestPut("/task", idTaskUser1, data, callback, tokenUser1);
    });

    it('TaskId de outro usuario', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_BAD_REQUEST);
            assert.equal(response.body.message, "Essa tarefa nao existe");
            done();
        }

        const data = {
            "name": "Task Baixa",
            "priority": "baixa"
        }

        requestPut("/task", idTaskUser2, data, callback, tokenUser1);
    });

    it('Prioridade invalida', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_BAD_REQUEST);
            done();
        }

        const data = {
            "priority": "outra"
        }

        requestPut("/task", idTaskUser1, data, callback, tokenUser1);
    });

    it('Alterar nome com sucesso', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_NO_CONTENT);
            done();
        }

        const data = {
            "name": "Outra Task"
        }

        requestPut("/task", idTaskUser1, data, callback, tokenUser1);
    });

    it('Alterar prioridade com sucesso', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_NO_CONTENT);
            done();
        }

        const data = {
            "priority": "baixa"
        }

        requestPut("/task", idTaskUser1, data, callback, tokenUser1);
    });

    it('Validar Alteracoes', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_OK);
            assert.equal(response.body.length, 2);
            response.body.forEach(task => {
                if(task._id === idTaskUser1) {
                    assert.equal(task.priority, "baixa");
                    assert.equal(task.name, "Outra Task");
                }
            })
            done();
        }

        requestGet("/tasks", callback, tokenUser1);
    });
});

describe('Deletar tarefas', async () => {
    it('Sem token', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_UNAUTHORIZED);
            assert.equal(response.body.message, "Acesso nao autorizado");
            done();
        }

        requestDelete("/task", idTaskUser1, callback);
    });

    it('Token invalido', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_UNAUTHORIZED);
            assert.equal(response.body.message, "invalid signature");
            done();
        }

        requestDelete("/task", idTaskUser1, callback, tokenUser1 + "error");
    });

    it('TaskId de outro usuario', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_BAD_REQUEST);
            assert.equal(response.body.message, "Essa tarefa nao existe");
            done();
        }

        requestDelete("/task", idTaskUser2, callback, tokenUser1);
    });

    it('Deletar com sucesso', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_NO_CONTENT);
            done();
        }

        requestDelete("/task", idTaskUser1, callback, tokenUser1);
    });

    it('Validar Alteracoes', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_OK);
            assert.equal(response.body.length, 1);
            response.body.forEach(task => {
                if(task._id === idTaskUser1) {
                    assert.fail()
                }
            })
            done();
        }

        requestGet("/tasks", callback, tokenUser1);
    });
});