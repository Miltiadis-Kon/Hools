//Imports
const express = require("express");
const router = express.Router();
const clubController = require("../controllers/club-controller");

///Define api endpoints
//GET
router.get("/",(req,res,next) => { 
clubController.getClubs(req,res,next);
});

//Export module
module.exports = router;