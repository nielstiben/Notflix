const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create film schema
const MovieSchema = new Schema({
    IMDB: {type: String, Required: true},
    title: {type: String, Required: true},
    publicationDate: {type: Date, Required: true},
    length: {type: String, Required: true},
    director: {type: String, Required: true},
    description: {type: String, Required: true},
    ratings: [{
        username: {type: String, required: false},
        rate: {type: Number, required: false},
    }]
});
module.exports = mongoose.model('Movie', MovieSchema);

