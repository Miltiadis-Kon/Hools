const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  footballAPI_id: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: Date, required: true },
  referee: { type: Array, required: false },
  venue: { type: Object, required: true },
  match_status: { type: String, required: false },
  score: { type: String, required: false },

  home_team: { type: Object, required: true },
  home_scorers: { type: Array, required: false },
  home_statistics: { type: Array, required: false },
  home_formation: [{ type: String, value: Number }],
  home_lineup: { type: Array, required: false },
  home_substitutes: { type: Array, required: false },

    away_team: { type: Object, required: true },
  away_scorers: { type: Array, required: false },
  away_statistics: { type: Array, required: false },
    away_formation:  [{ type: String, value: Number }],
  away_lineup: { type: Array, required: false },
  away_substitutes: { type: Array, required: false },
},
{

    collection: 'hools.matches'
}
);

module.exports = mongoose.model("Match", MatchSchema);

// Path: backend/models/match.js
