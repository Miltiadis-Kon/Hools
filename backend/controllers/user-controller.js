const user = require("../models/user");
const HttpError = require("../models/http-errors");
const mongoose = require("mongoose");

//Functions
//Search user by Id.
const getUserByID = async (req, res, next) => {
  // get a user by id
  const userID = req.params.userID; // get the user id from the request params
  let _user;
  try {
    _user =await user.findOne({ email: userID }); // find the user in the database
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a user.",
      500
    );
    return next(error);
  }
  if (!_user) {
    const error = new HttpError(
      "Could not find a user for the provided id.",
      404
    );
    return next(error);
  }
 return res.status(200).json({ user: _user }); // return the user to the client
};

const checkUsername = async (req, res, next) => {
  const username = req.params.username; // get the user id from the request params
  try{
  let founduser = await user.findOne({ name: username }); // find the user in the database
  if (founduser) {
    return res.status(200).json({answer :'false'});
  } else {
   return res.status(200).json({answer :'true'});
  }
  }catch(err){
    const error = new HttpError(
      "Something went wrong, could not find a user.",
      500
    );
    return next(error);
  }
};

const checkEmail = async (req, res, next) => {
  const email = req.params.email; // get the user id from the request params
  try{
  let founduser = await user.findOne({ email: email }); // find the user in the database
  if (founduser) {
   return res.status(200).json({answer :'false'});
  } else {
  return  res.status(200).json({answer :'true'});
  }
  }catch(err){
    const error = new HttpError(
      "Something went wrong, could not find a user.",
      500
    );
    return next(error);
  }
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
    const error = new HttpError(
      "Could not find any users in the database.",
      404
    );
    return next(error);
  }
 return res.status(200).json({ users: users }); // return the users to the client
};

const createUser = async (req, res, next) => {
  // create a user
  const { name, email, password, isAdmin,userID } = req.body; // get the user data from the request body
  const createdUser = new user({
    name,
    email,
    password,
    isAdmin,
    userID,
    clubs: [],
    tickets: [],
  }); // create a new user object
  try {
    console.log(createdUser);
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Creating user failed, please try again."+err, 500);
    return next(error);
  }
 return  res.status(201).json({ user: createdUser });
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
  return res.status(200).json({ message: "User deleted successfully" });
};

//TODO: Test this
const addFavoriteClub = async (req, res, next) => {
  const userID = req.params.userID; // get the user id from the request params
  const clubID = req.params.clubID; // get the club id from the request params
  //add the club to the user
  try {
    //Find user
    const _user = await user.findOne({ userID: userID });
    console.log(_user);
    //Check if club is already in user
    if (_user.clubs.includes(clubID)) {
      return res.status(200).json({ message: "Club already in user" });
    }
    //Add club to user
    else {
      _user.clubs.push(clubID);
      await _user.save();
      return   res.status(200).json({ message: "Club added to user successfully" });
    }
  } catch (err) {
    const error = new HttpError("Could not add club to user.\n"+err, 500);
    return next(error);
  }
};

exports.getUserByID = getUserByID;
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.deleteUser = deleteUser;
exports.addFavoriteClub = addFavoriteClub;
exports.checkUsername = checkUsername;
exports.checkEmail = checkEmail;

