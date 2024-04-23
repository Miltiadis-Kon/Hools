const express = require("express");
const Router = express.Router();
const playerController = require("../controllers/player-controller");

//Define api endpoints
//GET
Router.get("/", playerController.getPlayers); // get all players
Router.get("/:playerID", playerController.getPlayerByID); // get a player by id

//POST
Router.post("/", playerController.createPlayer); // create a player
//PATCH
Router.patch("/:playerID", playerController.updatePlayer); // update a player
//DELETE
Router.delete("/:playerID", playerController.deletePlayer); // delete a player

//Export module
module.exports = Router;
// Path: backend/routes/player-routes.js
