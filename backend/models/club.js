const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const ClubSchema = new Schema({
  name: { type: String, required: true },
  footballAPI_id: { type: String, required: true },
  logo: { type: String, required: true },
  founded: { type: String, required: false },
  field_name: { type: String, required: false },
  field_capacity: { type: String, required: false },
  field_img: { type: String, required: false },
  tickets_link: { type: String, required: false },
  players: { type: Array, required: false },
  leagueStanding: { type: Object, required: false },
  matches: { type: Array, required: false },
  next_match: { type: Object, required: false },
  last_match: { type: Object, required: false },
  coach: { type: Object, required: false },
},
{
    collection: 'hools.clubs.2'
});

//Create Model from Schema and export
module.exports = mongoose.model("Club", ClubSchema);
