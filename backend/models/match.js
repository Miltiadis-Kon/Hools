const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  home_team: { type: Object, required: true },
  away_team: { type: Object, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  tickets_link: { type: String, required: false },
  score: { type: String, required: false },
  statistics: { type: Object, required: false },
},
{
    collection: 'hools.matches'
}
);

module.exports = mongoose.model("Match", MatchSchema);

// Path: backend/models/match.js
