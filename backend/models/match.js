const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  footballAPI_id: { type: Number, required: true },
  home_team: { type: Object, required: true },
  away_team: { type: Object, required: true },
  score: { type: String, required: false },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: Object, required: true },
  statistics: { type: Object, required: false },
},
{
    collection: 'hools.matches'
}
);

module.exports = mongoose.model("Match", MatchSchema);

// Path: backend/models/match.js
