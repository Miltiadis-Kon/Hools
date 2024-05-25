const HttpError = require("../models/http-errors");
const stand = require("../models/standings");
const match = require("../models/match");

const getstandings = async (req, res, next) => {
    let standings;
    try {
        standings = await stand.find({}); // get all standings from the database
    } catch (err) {
        const error = new HttpError(
        "Something went wrong, could not find a standings.",
        500
        );
        return next(error);
    }
    if (!standings || standings.length == 0) {
        // if the standings does not exist, throw an error\
        const error = new HttpError("Could not find standings.", 404);
        return next(error);
    }
    res.json({ standings }); // return the standings to the client
    }

const get_match = async (req, res, next) => {
    const match_id = req.params.match_id;
    if (isNaN(parseInt(match_id))) {
        const error = new HttpError("Invalid club ID.", 400);
        return next(error);
      }
    let _m;
    try
    {
        _m = await match.find({ footballAPI_id: match_id }); // get the match from the database
    
    }
    catch(err){
        const error = new HttpError("Something error, could not find the match", 500);
        return next(error);
    }
    if (!_m || _m.length == 0) {
        // if the match does not exist, throw an error
        const error = new HttpError("Could not find the match.", 404);
        return next(error);
    }
    res.json({ _m }); // return the match to the client
    }

const get_matches = async (req, res, next) => {
    const from_date = req.params.from_date;
    const to_date = req.params.to_date;
    // 10_04_24/12_05_24
    //2024-04-28T17:30:00.000+00:00

    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split("_");
        let formattedDate = `20${year}-${month}-${day}T00:00:00.000+00:00`;
        formattedDate = new Date(formattedDate);
        formattedDate = formattedDate.toISOString();
        return formattedDate;
    };

    const formattedFromDate = formatDate(from_date);
    const formattedToDate = formatDate(to_date);

    let recent_matches;
    //scan based on date and time to get the recent matches
    try {
        recent_matches = await match.find({ date:{$gte:formattedFromDate,$lte:formattedToDate }  }); // get all recent matches from the database based on date and time
    } catch (err) {
        const error = new HttpError(err,
        500
        );
        return next(error);
    }
    if (!recent_matches || recent_matches.length == 0) {
        // if the recent matches do not exist, throw an error
        const error = new HttpError("Could not find recent matches.", 404);
        return next(error);
    }
    res.json({ recent_matches }); // return the recent matches to the client
    }

exports.getstandings = getstandings;
exports.get_matches = get_matches; 
exports.get_match = get_match;