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

function requestPost(url, data, callback) {
    chai.request(server)
        .post(url)
        .set('Accept', 'application/json')
        .send(data)
        .end(callback);
}

function requestGet(url, token, callback) {
    chai.request(server)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .end(callback);
}

const validUser = {
    "name": "Pedro",
    "email": "email1@codexjr.com.br",
    "password": "12345678"
}

let token = null;

before(async () => {
    const mongoServer = new MongoInMemory.MongoMemoryServer();
    dataBaseConfig(await mongoServer.getUri());
});

describe('Create User', async () => {
    it('Adicionando usuario valido', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_CREATED);
            response.body.should.have.property('_id');
            response.body.should.have.property('name');
            response.body.should.have.property('email');
            response.body.should.not.have.property('passwordHash');
            done();
        }

        requestPost("/users", validUser, callback);
    });

    it('Campos invalidos', (done) => {
        const data1 = {
            "email": "email@codexjr.com.br",
            "password": "1234"
        }

        function callback(error, response) {
            response.should.have.status(HTTP_CODE_BAD_REQUEST);
            assert.equal(response.body.message, "O campo name eh obrigatorio");
            done();
        }

        requestPost("/users", data1, callback);
    });

    it('Email invalido', (done) => {
        const data1 = {
            "name": "Pedro",
            "email": "email",
            "password": "12345678"
        }

        function callback(error, response) {
            response.should.have.status(HTTP_CODE_BAD_REQUEST);
            assert.equal(response.body.message, "Formato do email invalido");
            done();
        }

        requestPost("/users", data1, callback);
    });

    it('Senha com menos de 8 caracteres', (done) => {
        const data1 = {
            "name": "Pedro",
            "email": "email@ccodexjr.com.br",
            "password": "1234567"
        }

        function callback(error, response) {
            response.should.have.status(HTTP_CODE_BAD_REQUEST);
            assert.equal(response.body.message, "O campo password precisa ser maior que 8 caracteres");
            done();
        }

        requestPost("/users", data1, callback);
    });

    it('Usuario Existente', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_BAD_REQUEST);
            assert.equal(response.body.message, 'Já existe um usuário com esse email');
            done();
        }

        requestPost("/users", validUser, callback);
    });

})

describe('Login', async () => {
    it('Campos invalidos', (done) => {
        const data1 = {
            "email": "email1@codexjr.com.br",
        }

        function callback(error, response) {
            response.should.have.status(HTTP_CODE_UNAUTHORIZED);
            assert.equal(response.body.message, "Acesso nao autorizado");
            done();
        }

        requestPost("/users/login", data1, callback);
    });

    it('Login com email nao cadastrado', (done) => {
        const data = {
            "email": "email@gmail.com",
            "password": "1234"
        }

        function callback(error, response) {
            response.should.have.status(HTTP_CODE_UNAUTHORIZED);
            assert.equal(response.body.message, "Email ou senha invalidos");
            done();
        }
        requestPost("/users/login", data, callback);
    });

    it('Login com senha invalida', (done) => {
        const data = {
            "email": validUser.email,
            "password": "senhaErrada"
        }

        function callback(error, response) {
            response.should.have.status(HTTP_CODE_UNAUTHORIZED);
            assert.equal(response.body.message, "Email ou senha invalidos");
            done();
        }
        requestPost("/users/login", data, callback);
    });

    it('Login valido', (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_OK);
            response.body.should.have.property('access_token');
            response.body.should.have.property('token_type');
            assert.equal(response.body.token_type, "Bearer");
            token = response.body.access_token;
            done();
        }
        requestPost("/users/login", validUser, callback);
    });
});

describe("Logout", async () => {
    it("Token Invalido", (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_UNAUTHORIZED);
            assert.equal(response.body.message, "invalid signature");
            done();
        }

        requestGet("/users/logout", token+"error", callback);
    });

    it("Logout com Sucesso", (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_NO_CONTENT);
            done();
        }

        requestGet("/users/logout", token, callback);
    });

    it("Logout com token apos logout", (done) => {
        function callback(error, response) {
            response.should.have.status(HTTP_CODE_UNAUTHORIZED);
            assert.equal(response.body.message, "Token expirado");
            done();
        }

        requestGet("/users/logout", token, callback);
    });
});
