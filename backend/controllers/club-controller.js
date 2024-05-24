///Imports
const club = require("../models/club");
const HttpError = require("../models/http-errors");
///Functions
//Search club by Id.
const getclubByID = async (req, res, next) => {
  const clubID = req.params.clubID;
  let _club;
  try {
    _club = await club.find({footballAPI_id:clubID});
    if (!_club || _club.length === 0) {
      const error = new HttpError(
        "Could not find a club for the provided id.",
        404
      );
      return next(error);
    }
    res.json({ _club }); // return club in json format
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a club from ID.",
      500
    );
    return next(error);
  }
}

const getclubs = async (req, res, next) => {
  let clubs;
  try {
    clubs = await club.find({}); // get all clubs from the database
    if (!clubs || clubs.length == 0) {
      // if the club does not exist, throw an error\
      const error = new HttpError("Could not find clubs.", 404);
      return next(error);
      
    }
    else res.json({ clubs }); // return the club to the client
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a club.",
      500
    );
    return next(error);
  }
};

///Export module
exports.getclubByID = getclubByID;
exports.getclubs = getclubs;