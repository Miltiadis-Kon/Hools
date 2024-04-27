const user = require("../models/user");
const HttpError = require("../models/http-errors");
const mongoose = require("mongoose");

//Functions
//Search user by Id.
const getUserByID = async (req, res, next) => {
  // get a user by id
  const userID = req.params.userID; // get the user id from the request params
  let user;
  try {
    user = await user.findById(userID); // find the user in the database
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a user.",
      500
    );
    return next(error);
  }
  if (!user) {
    throw new HttpError("Could not find a user for the provided id.", 404); // if the user does not exist, throw an error
  }
  res.json({ user: user.toObject({ getters: true }) });
};

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await user.find({}); // get all users from the database
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a user.",
      500
    );
    return next(error);
  }
  if (!users || users.length == 0) {
    // if the user does not exist, throw an error
    throw new HttpError("Could not find a user for the provided id.", 404);
  }
  res.json({ users }); // return the user to the client
};

const createUser = async (req, res, next) => {
  // create a new user
  const {
    name,
    email,
    password,
    clubs,
    tickets,
    notifications,
    settings,
    preferences,
    isAdmin,
  } = req.body; // get the data from the request body
  const createdUser = new user({
    // create a new user object
    name,
    email,
    password,
    clubs,
    tickets,
    notifications,
    settings,
    preferences,
    isAdmin,
  });
  try {
    await createdUser.save(); // save the new user to the database
  } catch (err) {
    const error = new HttpError("Creating user failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ user: createdUser }); // return the new user to the client
};

const updateUser = async (req, res, next) => {
  const userID = req.params.userID; // get the user id from the request params
  //delete the user from the database
  try {
    await user.findByIdAndUpdate(userID, {
      name: "test",
      email: "test",
      password: "test",
      clubs: "test",
      tickets: "test",
      notifications: "test",
      settings: "test",
      preferences: "test",
      isAdmin: "test",
    });
  } catch (err) {
    const error = new HttpError("Could not update user.", 500);
    return next(error);
  }
  res.status(200).json({ message: "User updated successfully" });
};

const deleteUser = async (req, res, next) => {
  const userID = req.params.userID; // get the user id from the request params
  //delete the user from the database
  try {
    await user.findByIdAndRemove(userID);
  } catch (err) {
    const error = new HttpError("Could not delete user.", 500);
    return next(error);
  }
  res.status(200).json({ message: "User deleted successfully" });
};

//TODO: Test this
const addFavoriteClub = async (req, res, next) => {
  const userID = req.params.userID; // get the user id from the request params
  const clubID = req.params.clubID; // get the club id from the request params
  //add the club to the user
  try {
    //Find user
    const user = await user.findById(userID);
    //Check if club is already in user
    if (user.clubs.includes(clubID)) {
      //Remove club from user
      user.clubs.pull(clubID);
    }
    //Add club to user
    else {
      user.clubs.push(clubID);
    }
  } catch (err) {
    const error = new HttpError("Could not add club to user.", 500);
    return next(error);
  }
  res.status(200).json({ message: "Club added to user successfully" });
};

exports.getUserByID = getUserByID;
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.addFavoriteClub = addFavoriteClub;
