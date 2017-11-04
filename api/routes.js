'use strict';
module.exports = function (app) {
    const express = require('express');
    const userController = require('./controllers/UserController');
    const movieController = require('./controllers/MovieController');

    // API URL prefix
    const urlPrefix = '/api';

    // Movies
    app.route(urlPrefix + '/movies')
        .get(movieController.get_all_movies);
    app.route(urlPrefix + '/movie')
        .get(movieController.get_movie_imdb);
    app.route(urlPrefix + '/movie/rate')
        .put(movieController.set_rating)
        .delete(movieController.delete_rating);

    // Users
    app.route(urlPrefix + '/users')
        .get(userController.get_users_all);

    app.route(urlPrefix + '/user')
        .get(userController.get_user_username);

    // Authentication
    app.route(urlPrefix + '/auth/login')
        .post(userController.login);
    app.route(urlPrefix + '/auth/register')
        .post(userController.register);
    app.route(urlPrefix + '/auth/validate')
        .get(userController.validate_token);

    // Dummies
    // app.route('/create-dummies')
    //     .put(userController.create_dummies, movieController.create_dummies);

    // Serve static content (from www folder)
    app.use('/', express.static('www'));

    // Return 404 in JSON format when request URL starts with the API prefix.
    app.use(function (req, res) {
        if(req.originalUrl.includes(urlPrefix)) {
            let errorObj = {};
            errorObj['error 404'] = 'URL not found';
            res.status(404).send(errorObj)
        }else{
            //todo: proper 404 page
            res.status(404).send("404 not found")
        }
    });

};
