'use strict';
const mongoose = require('mongoose'),
    User = require('../models/UserModel'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');

console.log("    -user controller loaded;");


// Authentication
// Login
exports.login = function (req, res) {
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.status(404).json({message: 'Authentication failed. User not found.'});
        } else if (user) {
            if (!user.comparePassword(req.body.password)) {
                res.status(401).json({message: 'Authentication failed. Wrong password.'});
            } else {


                res.status(200);
                return res.json({
                    token: jwt.sign({
                            username: user.username,
                            firstname: user.firstname,
                            _id: user._id
                        }, 'RESTFULAPIs',
                        {expiresIn: '2h'})
                });
            }
        }
    });
};

// Register a new user
exports.register = function (req, res) {
    // Validate input
    if (req.body.username && req.body.username.length > 0 && req.body.username.length <= 64) {
        if (req.body.password && req.body.password.length > 3 && req.body.password.length <= 64) {
            if (req.body.firstname && req.body.firstname.length > 0 && req.body.firstname.length <= 64) {
                if (req.body.lastname && req.body.lastname.length > 0 && req.body.lastname.length <= 64) {
                    // Check for unique username
                    User.find({}, (err, users) => {
                        if (err) {
                            //todo  handle error
                        }
                        // Loop trough each user and add to array
                        User.findOne({"username": req.body.username}, function (err, user) {
                            // Username found
                            if (user) {
                                let errorObj = {};
                                errorObj['error'] = 'Username already exists.';
                                res.status(409).send(errorObj)
                            }
                            // User not found
                            else {
                                // Save model to database
                                const newUser = new User(req.body);
                                newUser.password = bcrypt.hashSync(req.body.password, 10);
                                newUser.save(function (err, user) {
                                    if (err) {
                                        res.status(400).send({
                                            message: err
                                        });
                                    } else {
                                        let successObj = {};
                                        successObj['success'] = 'User has been created.';
                                        res.status(201).send(successObj)
                                    }
                                });
                            }

                        });
                    })
                }
                // Invalid last name
                else {
                    let errorObj = {};
                    errorObj['error'] = 'Last name is not valid. It must contain 1 characters with a maximum of 64 characters.';
                    res.status(400).send(errorObj)
                }
            }
            // Invalid first name
            else {
                let errorObj = {};
                errorObj['error'] = 'First name is not valid. It must contain 1 characters with a maximum of 64 characters.';
                res.status(400).send(errorObj)
            }
        }
        // Invalid password
        else {
            let errorObj = {};
            errorObj['error'] = 'Password not sufficient. It must contain 4 characters with a maximum of 64 characters.';
            res.status(400).send(errorObj)
        }
    }
    // Invalid username
    else {
        let errorObj = {};
        errorObj['error'] = 'Username not valid. It must contain 1 character with a maximum of 64 characters.';
        res.status(400).send(errorObj)
    }
};

exports.validate_token = function (req, res) {
    if (req.user) {
        return res.status(200).json({message: "Token is authorized"})
    } else {
        return res.status(401).json({message: "Invalid token"})
    }
};

// Users
// GET al list of all users
exports.get_users_all = function (req, res) {
    // User is authenticated
    if (req.user) {
        User.find({}, (err, users) => {
            if (err) {
                //todo  handle error
            }

            // create user object with an array as value
            const userJSONString = '{"users":[]}';
            const userObj = JSON.parse(userJSONString);

            // Loop trough each user and add to array
            for (let i = 0; i < users.length; i++) {

                userObj["users"].push({
                    username: users[i].username,
                    firstname: users[i].firstname,
                    middlename: users[i].middlename,
                    lastname: users[i].lastname
                });
            }
            res.status(200).json(userObj);
        });
    }
    // User is unauthorized
    else {
        let errorObj = {};
        errorObj['error'] = 'not authorized';
        res.status(401).send(errorObj)
    }
};

// GET a single user based on user name
exports.get_user_username = function (req, res) {
    // User is authenticated
    if (req.user) {

        User.findOne({"username": req.query.username}, function (err, user) {
            // User found
            if (user) {

                const userObj = {
                    username: user.username,
                    firstname: user.firstname,
                    middlename: user.middlename,
                    lastname: user.lastname
                };

                res.status(200).send(userObj);
            }
            // User not found
            else {
                let errorObj = {};
                errorObj['error'] = 'User not found';
                res.status(404).send(errorObj)
            }

        });
    }
    // User is unauthorized
    else {
        let errorObj = {};
        errorObj['error'] = 'not authorized';
        res.status(401).send(errorObj)
    }
};
