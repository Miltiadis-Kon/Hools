
const express = require('express');
const Router = express.Router();

const userController = require('../controllers/user-controller');

//Define api endpoints
//GET
Router.get('/allusers/', userController.getUsers); // get all users
Router.get('/getuser/:userID', userController.getUserByID); // get a user by id

//POST
Router.post('/createuser/', userController.createUser); // create a user

//DELETE
Router.delete('/deleteuser/:userID', userController.deleteUser); // delete a user

Router.get('/addclub/:userID/:clubID', userController.addFavoriteClub); // add a favorite club

Router.get('/checkname/:username', userController.checkUsername); // check if username exists
Router.get('/checkmail/:email', userController.checkEmail); // check if email exists


//Export module
module.exports = Router;