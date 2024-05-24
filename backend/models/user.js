const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    isAdmin: { type: Boolean, required: true },
    userID: { type: String, required: true },
    clubs: { type: Array, required: false },
    tickets: { type: Array, required: false },
  },
  {
    collection: "hools.users",
  }
);

//Create Model from Schema and export
module.exports = mongoose.model("User", UserSchema);
// Path: backend/models/user.js
