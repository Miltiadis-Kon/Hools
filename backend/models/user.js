const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    clubs: { type: Object, required: false },
    tickets: { type: Object, required: false },
    notifications: { type: Object, required: false },
    settings: { type: Object, required: false },
    isAdmin: { type: Boolean, required: true },
  },
  {
    collection: "hools.users",
  }
);

//Create Model from Schema and export
module.exports = mongoose.model("User", UserSchema);
// Path: backend/models/user.js
