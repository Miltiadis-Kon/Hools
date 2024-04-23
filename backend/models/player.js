const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    number: { type: Number, required: true },
    goals: { type: Number, required: true },
    club: { type: String, required:true }
});

//Create Model from Schema and export

module.exports = mongoose.model("Player", PlayerSchema);
// Path: backend/models/club.js
