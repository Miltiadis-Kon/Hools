const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StandingsSchema = new Schema({
    league : {type:Object,required:true},
    standings: [{
        rank: {type: Number, required: true},
        teamId: {type: String, required: true},
        teamName: {type: String, required: true},
        teamLogo: {type: String, required: true},
        points: {type: Number, required: true},
        played: {type: Number, required: true},
        wins: {type: Number, required: true},
        defeats: {type: Number, required: true},
        losses: {type: Number, required: true},
        goaldiff: {type: Number, required: true},
        form: {type: String, required: true}
    }],
    season:{type:String,required:true},
},
{
    collection: 'hools.standings'
});

module.exports = mongoose.model("Standings", StandingsSchema);