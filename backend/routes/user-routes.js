
const express = require('express');
const Router = express.Router();

const userController = require('../controllers/user-controller');

//Define api endpoints
//GET
Router.get('/', userController.getUsers); // get all users
Router.get('/:userID', userController.getUserByID); // get a user by id

//POST
Router.post('/', userController.createUser); // create a user
//PATCH
Router.patch('/:userID', userController.updateUser); // update a user
//DELETE
Router.delete('/:userID', userController.deleteUser); // delete a user

Router.patch('/clubs/', userController.addFavoriteClub); // add a favorite club

Router.get('/:username', userController.checkUsername); // check if username exists
Router.get('/:email', userController.checkEmail); // check if email exists


//Export module
module.exports = Router;