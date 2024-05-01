const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const ClubSchema = new Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  field: { type: String, required: false },
  tickets_link: { type: String, required: false },
  players: { type: Array, required: false },
  leagueStanding: { type: Object, required: false },
  matches: { type: Array, required: false },
  next_match: { type: String, required: false },
},
{
    collection: 'hools.clubs'
});

//Create Model from Schema and export
module.exports = mongoose.model("Club", ClubSchema);
