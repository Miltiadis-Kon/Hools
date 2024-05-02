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
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a club from ID.",
      500
    );
    return next(error);
  }
  res.json({ _club }); // return club in json format
}

const getclubs = async (req, res, next) => {
  let clubs;
  try {
    clubs = await club.find({}); // get all clubs from the database
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a club.",
      500
    );
    return next(error);
  }
  if (!clubs || clubs.length == 0) {
    // if the club does not exist, throw an error\
    const error = new HttpError("Could not find clubs.", 404);
    return next(error);
    
  }
  res.json({ clubs }); // return the club to the client
};

const createclub = async (req, res, next) => {
  // create a new club
  const { name, logo, field } = req.body; // get the data from the request body
  const createdclub = new club({
    // create a new club object
    name,
    logo,
    field,
  });
  try {
    await createdclub.save(); // save the new club to the database
  } catch (err) {
    const error = new HttpError("Creating club failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ club: createdclub }); // return the new club to the client
  console.log("club created");
};
const updateclub = async (req, res, next) => {
  const clubID = req.params.clubID; // get the club id from the request params
  //delete the club from the database
  try {
    await club.findByIdAndUpdate(clubID, {
      name: "test",
      description: "test",
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update club.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Updated club." });
};
const deleteclub = async (req, res, next) => {
  const clubID = req.params.clubID; // get the club id from the request params
  //delete the club from the database
  try {
    await club.findByIdAndRemove(clubID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete club.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Deleted club." });
};

///Export module
exports.getclubByID = getclubByID;
exports.getclubs = getclubs;
exports.createclub = createclub;
exports.updateclub = updateclub;
exports.deleteclub = deleteclub;