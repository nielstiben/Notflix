const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// Create film schema
const UserSchema = new Schema({
    firstname: {type: String, Required: true},
    middlename: {type: String, Required: false},
    lastname: {type: String, Required: true},
    username: {type: String, Required: true},
    password: {type: String, Required: true},
});

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

// Export the model as Module
module.exports = mongoose.model('User', UserSchema);