const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const StandingsSchema = new Schema({
    league : {type:Object,required:true},
    standings:{type:Array,required:true },
    season:{type:String,required:true}
},
{
    collection: 'hools.standings'
}
);

module.exports = mongoose.model("Standings", StandingsSchema);
