const HttpError = require("../models/http-errors");
const stand = require("../models/standings");

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

const get_next_match = async (req, res, next) => {
    const team_id = req.params.team_id;
    let next_match;
    try {
        next_match = await match.find({ team_id: team_id }); // get the next match from the database
    } catch (err) {
        const error = new HttpError(
        "Something went wrong, could not find the next match.",
        500
        );
        return next(error);
    }
    if (!next_match || next_match.length == 0) {
        // if the next match does not exist, throw an error
        const error = new HttpError("Could not find the next match.", 404);
        return next(error);
    }
    res.json({ next_match }); // return the next match to the client
    }

const get_upcoming_matches = async (req, res, next) => {
    let upcoming_matches;
    try {
        upcoming_matches = await match.find({}); // get all upcoming matches from the database
    } catch (err) {
        const error = new HttpError(
        "Something went wrong, could not find upcoming matches.",
        500
        );
        return next(error);
    }
    if (!upcoming_matches || upcoming_matches.length == 0) {
        // if the upcoming matches do not exist, throw an error
        const error = new HttpError("Could not find upcoming matches.", 404);
        return next(error);
    }
    res.json({ upcoming_matches }); // return the upcoming matches to the client
    }

const get_match = async (req, res, next) => {
    const match_id = req.params.match_id;
    let match;
    try
    {
        match = await match.find({ match_id: match_id }); // get the match from the database
    
    }
    catch(err){
        const error = new HttpError("Something error, could not find the match", 500);
        return next(error);
    }
    if (!match || match.length == 0) {
        // if the match does not exist, throw an error
        const error = new HttpError("Could not find the match.", 404);
        return next(error);
    }
    res.json({ match }); // return the match to the client
    }


exports.getstandings = getstandings;
exports.get_next_match = get_next_match;
exports.get_upcoming_matches = get_upcoming_matches;
exports.get_match = get_match;