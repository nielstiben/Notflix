'use strict';

// api/controllers/movies.js
const mongoose = require('mongoose'),
    Movie = require('../models/MovieModel'),
    User = require('../models/UserModel');

console.log("    -movie controller loaded;");

// GET a list of all the movies
exports.get_all_movies = function (req, res) {
    Movie.find({}, (err, movies) => {
        if (err) {
            //todo  handle error
        }

        // create movies object with an array as value
        const moviesJSONString = '{"movies":[]}';
        const moviesObj = JSON.parse(moviesJSONString);

        // Loop trough each movie and add to array
        for (let i = 0; i < movies.length; i++) {

            // Loop through each rating
            let ratingsSum = 0;
            let personalRating = 0;
            for (let y = 0; y < movies[i].ratings.length; y++) {
                // calculate average
                ratingsSum += movies[i].ratings[y].rate;

                // Check if own rating
                if (req.user) {
                    if (req.user.username === movies[i].ratings[y].username) {
                        personalRating = movies[i].ratings[y].rate;
                    }
                }
            }

            // calculate average rate of all ratings combined
            let ratingObj = {};
            if (movies[i].ratings.length !== 0) {
                const averageRating = ratingsSum / movies[i].ratings.length;

                // add the global (average) rating if existing
                if (averageRating > 0) {
                    ratingObj['global'] = averageRating;
                }

                if (personalRating > 0) {
                    ratingObj['personal'] = personalRating;
                }
            }

            moviesObj["movies"].push({
                id: movies[i]._id,
                IMDB: movies[i].IMDB,
                title: movies[i].title,
                publicationDate: movies[i].publicationDate,
                length: movies[i].length,
                director: movies[i].director,
                description: movies[i].title,
                rating: ratingObj
            });
        }
        res.status(200).json(moviesObj)
    });
};

// GET a movie based on its IMDB
exports.get_movie_imdb = function (req, res) {
    Movie.findOne({"IMDB": req.query.IMDB}, function (err, movie) {
        // Movie found
        if (movie) {
            // Loop through each rating
            let ratingsSum = 0;
            let personalRating = 0;
            for (let y = 0; y < movie.ratings.length; y++) {
                // calculate average
                ratingsSum += movie.ratings[y].rate;

                // Check if own rating
                if (req.user) {
                    if (req.user.username === movie.ratings[y].username) {
                        personalRating = movie.ratings[y].rate;
                    }
                }
            }

            // calculate average rate of all ratings combined
            let ratingObj = {};
            if (movie.ratings.length !== 0) {
                const averageRating = ratingsSum / movie.ratings.length;

                // add the global (average) rating if existing
                if (averageRating > 0) {
                    ratingObj['global'] = averageRating;
                }

                if (personalRating > 0) {
                    ratingObj['personal'] = personalRating;
                }
            }
            const movieObj = {
                id: movie._id,
                IMDB: movie.IMDB,
                title: movie.title,
                publicationDate: movie.publicationDate,
                length: movie.length,
                director: movie.director,
                description: movie.title,
                rating: ratingObj
            };

            res.status(200).send(movieObj);
        }
        // Movie not found
        else {
            let errorObj = {};
            errorObj['error'] = 'Movie not found';
            res.status(404).send(errorObj)
        }

    });
};

// PUT a rating
exports.set_rating = function (req, res) {

    // User is authorized
    if (req.user) {

        // Rate input is valid
        const rate = parseFloat(req.body.rate);
        if (rate >= 0.5 && rate <= 5) {

            // Obtain info about the user
            User.findOne({"username": req.user.username}, function (err, user) {

                // User allowed
                if (user) {

                    // Find movie
                    Movie.findOne(
                        function (err, movie) {

                            // error handling
                            if (err) {
                                console.error(err);
                            }

                            // movie found
                            if (movie) {
                                let createNewRating = true;

                                // Find and modify current rating, if it exists
                                for (let y = 0; y < movie.ratings.length; y++) {
                                    if (movie.ratings[y].username === user.username) {
                                        // existing rating found
                                        createNewRating = false;
                                        movie.ratings[y].rate = rate;
                                        movie.save();
                                        y = movie.ratings.length;
                                    }
                                }

                                // If current rating does not exists, create a new one
                                if (createNewRating) {
                                    movie.ratings.push({
                                        "rate": rate,
                                        "username": user.username
                                    });
                                    movie.save();

                                    let successObj = {};
                                    successObj['success'] = 'rating created';
                                    res.status(202).send(successObj)
                                }
                                // Rating is alter-existing and is already modified; return success message only.
                                else {
                                    let successObj = {};
                                    successObj['success'] = 'rating modified';
                                    res.status(200).send(successObj)
                                }

                            }

                            // movie not found
                            else {
                                let errorObj = {};
                                errorObj['error'] = 'movie not found';
                                res.status(404).send(errorObj);
                            }
                        }
                    );

                    // User is not allowed
                }

                // User not allowed
                else {
                    let errorObj = {};
                    errorObj['error'] = 'not allowed';
                    res.status(403).send(errorObj)
                }

            });
        }

        // Rate input is invalid
        else {
            const errorObj = {};
            errorObj['error'] = 'rate must be somewhere between 0.5 and 5';
            res.status(400).send(errorObj)
        }
    }

    // User is unauthorized
    else {
        let errorObj = {};
        errorObj['error'] = 'not authorized';
        res.status(401).send(errorObj)
    }
};

// DELETE a rating
exports.delete_rating = function (req, res) {

    // User is authorized
    if (req.user) {

            // Obtain info about the user
            User.findOne({"username": req.user.username}, function (err, user) {

                // User allowed
                if (user) {

                    // Find movie
                    Movie.findOne(
                        function (err, movie) {

                            // error handling
                            if (err) {
                                console.error(err);
                            }

                            // movie found
                            if (movie) {
                                let ratingFound = false;

                                // Find and modify current rating, if it exists
                                for (let y = 0; y < movie.ratings.length; y++) {

                                    // existing rating found
                                    if (movie.ratings[y].username === user.username) {
                                        ratingFound = true;
                                        movie.ratings[y].remove();
                                        movie.save();
                                        y = movie.ratings.length;
                                    }
                                }

                                if(ratingFound){
                                    let successObj = {};
                                   successObj['success'] = 'Rating deleted';
                                    res.status(200).send(successObj);
                                }else{
                                    let errorObj = {};
                                    errorObj['error'] = 'Rating not found';
                                    res.status(404).send(errorObj);
                                }
                            }

                            // movie not found
                            else {
                                let errorObj = {};
                                errorObj['error'] = 'Movie not found';
                                res.status(404).send(errorObj);
                            }
                        }
                    );

                    // User is not allowed
                }

                // User not allowed
                else {
                    let errorObj = {};
                    errorObj['error'] = 'Not allowed';
                    res.status(403).send(errorObj)
                }

            });
    }

    // User is unauthorized
    else {
        let errorObj = {};
        errorObj['error'] = 'Not authorized';
        res.status(401).send(errorObj)
    }
};

