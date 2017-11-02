'use strict';

var app = require('../server'),
    chai = require('chai'),
    request = require('supertest');

var expect = chai.expect;

describe('Movie list API Integration Tests', function() {
    describe('#GET /movies', function() {
        it('should get all tasks', function(done) {
            request(app) .get('/movies')
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    expect("Content-type", /json/)
                    done();
                });
        });
    });

    describe('#GET Get a movie by id', function() {
        it('should get a task', function(done) {
            request(app)
                .get('/movie')
                .query({ IMDB: '0111161'})
                .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.body.title).to.equal('The Shawshank Redemption');
                done();
            });
        });
        it('should return movie not found', function (done) {
            request(app)
                .get('/movie')
                .query({ IMDB: 'sadgfafeadsfadsfew'})
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(404);
                    expect(res.body).to.equal('movie not found');
                    done();
                });
        })
    });

    describe('#GET /users', function() {
        it('should get all users', function(done) {
            request(app) .get('/users')
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    expect("Content-type", /json/)
                    done();
                });
        });
    });
});

