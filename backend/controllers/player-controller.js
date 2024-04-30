const player = require("../models/player");
const HttpError = require("../models/http-errors");
const mongoose = require("mongoose");

//Functions
//Search player by Id.
const getPlayerByID = async (req, res, next) => {
  // get a player by id
  const playerID = req.params.playerID; // get the player id from the request params
  let player;
  try {
    player = await player.findById(playerID); // find the player in the database
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a player.",
      500
    );
    return next(error);
  }
  if (!player) {
    const error = new HttpError(
      "Could not find a player for the provided id.",
      404
    );
    return next(error);
  }
  res.json({ player: player.toObject({ getters: true }) });
};

const getPlayers = async (req, res, next) => {
  let players;
  try {
    players = await player.find({}); // get all players from the database
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a player.",
      500
    );
    return next(error);
  }
  if (!players || players.length == 0) {
    // if the player does not exist, throw an error
    const error = new HttpError("Could not find players.", 404);
    return next(error);
  }
  res.json({ players }); // return the player to the client
};

const createPlayer = async (req, res, next) => {
  // create a new player
  const { name, position, number, goals, club } = req.body; // get the data from the request body
  const createdPlayer = new player({
    // create a new player object
    name,
    position,
    number,
    goals,
    club,
  });
  try {
    await createdPlayer.save(); // save the new player to the database
  } catch (err) {
    const error = new HttpError(
      "Creating player failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ player: createdPlayer }); // return the new player to the client
};

const updatePlayer = async (req, res, next) => {
  const playerID = req.params.playerID; // get the player id from the request params
  //delete the player from the database
  try {
    await player.findByIdAndUpdate(playerID, {
      name: req.body.name,
      position: req.body.position,
      number: req.body.number,
      goals: req.body.goals,
      club: req.body.club,
    });
  } catch (err) {
    const error = new HttpError("Could not update player.", 500);
    return next(error);
  }
  res.status(200).json({ message: "Player updated successfully" });
};

const deletePlayer = async (req, res, next) => {
  const playerID = req.params.playerID; // get the player id from the request params
  let player;
  try {
    player = await player.findById(playerID);
  } catch (err) {
    const error = new HttpError("Could not delete player.", 500);
    return next(error);
  }
  try {
    await player.remove();
  } catch (err) {
    const error = new HttpError("Could not delete player.", 500);
    return next(error);
  }
  res.status(200).json({ message: "Player deleted successfully" });
};

//Export module
module.exports = {
  getPlayerByID,
  getPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
};

// Path: backend/controllers/player-controller.js
