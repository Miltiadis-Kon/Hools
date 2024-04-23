//Imports
const express = require("express");
const Router = express.Router();
const clubController = require("../controllers/club-controller");

///Define api endpoints
//GET
Router.get("/", clubController.getClubs); // get all clubs
Router.get("/:clubID", clubController.getClubByID); // get a club by id

//POST
Router.post("/", clubController.createClub); // create a club
//PATCH
Router.patch("/:clubID", clubController.updateClub); // update a club
//DELETE
Router.delete("/:clubID", clubController.deleteClub); // delete a club

//Export module
module.exports = Router;