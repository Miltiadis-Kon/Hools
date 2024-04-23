
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    clubs: { type: Object, required: true },
    tickets: { type: Object, required: true },
    notifications: { type: Object, required: true },
    settings: { type: Object, required: true },
    preferences: { type: Object, required: true },
    isAdmin : { type: Boolean, required: true }
});

//Create Model from Schema and export
module.exports = mongoose.model('User', UserSchema);
// Path: backend/models/user.js
