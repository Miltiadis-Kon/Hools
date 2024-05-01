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

exports.getstandings = getstandings;
