'use strict';

var app = require('../server'),
    chai = require('chai'),
    request = require('supertest');

var expect = chai.expect;

describe('Movie list API Integration Tests', function () {

    var token = null;


    before(function (done) {
        request(app).post('/api/auth/login')
            .send({"username": "ntiben", "password": "secret"})

            .end(function (err, res) {
                token = res.body.token; // Or something
                done();
            });
    });


    describe('#GET /api/movies', function () {
        it('should get all tasks', function (done) {
            request(app).get('/api/movies')
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect("Content-type", /json/)
                    console.log(token)
                    done();
                });
        });
    });

    describe('#GET Get a movie by id', function () {
        it('should get a task', function (done) {
            request(app)
                .get('/api/movie')
                .query({'IMDB': '0111161'})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.title).to.equal('The Shawshank Redemption');
                    done();
                });
        });
        it('should return movie not found', function (done) {
            request(app)
                .get('/api/movie')
                .query({IMDB: 'sadgfafeadsfadsfew'})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(404);
                    expect(res.body).eql({'error': 'Movie not found'});
                    done();
                });
        })
    });

    describe('Movie rating', function () {
        it('should create a rating on a movie', function (done) {
            request(app)
                .put('/api/movie/rate')
                .set({"imdb": "0111161", "Authorization": "JMT " + token})
                .send({"rate": "4"})
                // .query({IMDB: '0111161'})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(202);
                    expect(res.body.success).to.equal('rating created');
                    done();
                });
        });
        it('should not create a rating on a movie, return not authorized', function (done) {
            request(app)
                .put('/api/movie/rate')
                .set({"imdb": "0111161", "Authorization": "WRONG "})
                .send({"rate": "4"})
                // .query({IMDB: '0111161'})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(401);
                    expect(res.body.error).to.equal('not authorized');
                    done();
                });
        });
        it('should not create a rating on a movie, return invalid rate', function (done) {
            request(app)
                .put('/api/movie/rate')
                .set({"imdb": "TEST", "Authorization": "JMT " + token})
                .send({"rate": "4"})
                // .query({IMDB: '0111161'})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(404);
                    expect(res.body.error).to.equal('movie not found');
                    done();

                });
        });
        it('should delete a rating of a movie', function (done) {
            request(app)
                .delete('/api/movie/rate')
                .set({"imdb": "0111161", "username": "ntiben", "Authorization": "JMT " + token})
                // .query({IMDB: '0111161'})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal('Rating deleted');
                    done();
                });
        });

    });


    describe('#POST get token ', function () {
        it('should login and get a token', function (done) {
            request(app).post('/api/auth/login').send({"username": "ntiben", "password": "secret"})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect("Content-type", /json/)
                    done();
                });
        });
        it('should not login and return wrong password', function (done) {
            request(app).post('/api/auth/login').send({"username": "ntiben", "password": "wrong"})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(401);
                    expect("Content-type", /json/)
                    expect(res.body).eql({'message': 'Authentication failed. Wrong password.'});
                    done();
                });
        });
        it('should not login and return user not found', function (done) {
            request(app).post('/api/auth/login').send({"username": "", "password": "secret"})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(404);
                    expect("Content-type", /json/)
                    expect(res.body).eql({'message': 'Authentication failed. User not found.'});
                    done();
                });
        });

    });


    describe('#GET /api/users', function () {
        it('return a list of users', function (done) {
            request(app).get('/api/users')
                .set({"Authorization": "JMT " + token})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect("Content-type", /json/)
                    done();
                });
        });
    });

    describe('#GET /api/user', function () {
        it('should return a specific user', function (done) {
            request(app).get('/api/user')
                .set({"Authorization": "JMT " + token})
                .query({"username": "ntiben"})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect("Content-type", /json/)
                    done();
                });
        });
        it('should return a error not authorized', function (done) {
            request(app).get('/api/user')
                .set({"username": "ntiben"})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(401);
                    expect(res.body).eql({'error': 'not authorized'});
                    done();
                });
        });
        it('should return an error user not found', function (done) {
            request(app).get('/api/user')
                .set({"Authorization": "JMT " + token})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(404);
                    expect(res.body).eql({'error': 'User not found'});
                    done();
                });
        });
    });


    describe('#POST Create user ', function () {
        it('create a user', function (done) {
            request(app).post('/api/auth/register').send({
                "firstname": "Jan",
                "lastname": "Klaasen",
                "username": "jklaasen",
                "password": "datmagniemandweten"
            }).end(function (err, res) {
                expect(res.statusCode).to.equal(201);
                done();
            });
        });
        it('should not create a user, return user already exists', function (done) {
            after
            request(app).post('/api/auth/register').send({
                "firstname": "Jan",
                "lastname": "Klaasen",
                "username": "jklaasen",
                "password": "datmagniemandweten"
            }).end(function (err, res) {
                expect(res.statusCode).to.equal(409);
                expect(res.body).eql({'error': 'Username already exists.'});
                done();
            });

        });
        it('should not create a user, return an error ', function (done) {
            after(function () {
                request(app).post('/api/auth/register').send({
                    "firstname": "Jan",
                    "lastname": "",
                    "username": "jklaasen",
                    "password": "datmagniemandweten"
                }).end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    expect(res.body).eql({'error': 'Last name is not valid. It must contain 1 characters with a maximum of 64 characters.'});
                    done();
                });
            });
        });
        it('should not create a user, return an error', function (done) {
            request(app).post('/api/auth/register').send({
                "firstname": "",
                "lastname": "Klaasen",
                "username": "jklaasen",
                "password": "datmagniemandweten"
            }).end(function (err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.body).eql({'error': 'First name is not valid. It must contain 1 characters with a maximum of 64 characters.'});
                done();
            });
        });
        it('should not create a user, return an error ', function (done) {
            request(app).post('/api/auth/register').send({
                "firstname": "Jan",
                "lastname": "Klaasen",
                "username": "jklaasen",
                "password": "hasdfoi"
            }).end(function (err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.body).eql({'error': 'Password not sufficient. It must contain 4 characters with a maximum of 64 characters.'});
                done();
            });
        });
        it('should not create a user, return an error', function (done) {
            request(app).post('/api/auth/register').send({
                "firstname": "Jan",
                "lastname": "Klaasen",
                "username": "",
                "password": "hoasfi"
            }).end(function (err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.body).eql({'error': 'Username not valid. It must contain 1 character with a maximum of 64 characters.'});
                done();
            });
        });
    });

    describe('#GET /api/auth/validate', function () {
        it('should return a user info', function (done) {
            request(app).get('/api/users')
                .set({"Authorization": "JMT " + token})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect("Content-type", /json/)
                    done();
                });
        });
        it('should return an error unauthorized', function (done) {
            request(app).get('/api/users')
                .set({"Authorization": "Wrong "})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(401);
                    expect(res.body).eql({'error':'not authorized'});
                    done();
                });
        });

    });
});


