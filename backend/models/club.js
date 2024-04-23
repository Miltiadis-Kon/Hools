const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ClubSchema = new Schema({
  name: { type: String, required: true },
  logo : { type: String, required: true },
  field : { type: String, required: false },
  tickets_link : { type: String, required: false },
  players : { type: Object, required: true },
  next_match : { type: Object, required: true },
  leagueStanding : { type: Object, required: true },
});

//Create Model from Schema and export
module.exports = mongoose.model("Club", ClubSchema);