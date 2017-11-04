// /api/server.js
//const dummy = require('./createDummies'); // Uncomment for creating dummies

const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    jsonwebtoken = require("jsonwebtoken"),

    User = require('./controllers/UserController'),
    Movie = require('./controllers/MovieController'),
    bodyParser = require('body-parser');

// Connect to the database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/notflix', { useMongoClient: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Middleware to validate the token. Token must be in the header with key 'authorization' and value 'JMT <token>'; for instance: authentication:JMT ey12.........
app.use(function (req, res, next) {
    if (req.header && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JMT') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function (err, decode) {
            req.user = decode;
            next();
        });
    }
    else {
        req.user = undefined;
        next();
    }
});

// Setup routes
const routes = require('./routes'); // import route
routes(app); // register the route

app.listen(port);
console.log('Server listening on port ' + port);
module.exports = app;