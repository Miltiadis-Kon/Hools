// Add required packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Add required routes
const clubRouter = require("./routes/club-routes");
const matchRouter = require("./routes/match-routes");
const userRouter = require("./routes/user-routes");
const playerRouter = require("./routes/player-routes");
const cors = require("cors");

require("dotenv").config();

const app = express(); // create express app
app.use(cors()); //allow cross-origin requests
app.use(bodyParser.json()); // parse requests of content-type - application/json

// Assigns specific routes to the app
app.use("/clubs", (req, res, next) => {
  clubRouter(req, res, next);
});

app.use("/matches", (req, res, next) => {
  matchRouter(req, res, next);
});

app.use("/users", (req, res, next) => {
  userRouter(req, res, next);
});

app.use("/players", (req, res, next) => {
  playerRouter(req, res, next);
});

// Middleware to handle errors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //allow any domain to send requests
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" //allow these headers
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE"); //allow these methods
  next();
});
//error handling
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
}); //only used for API routes that are not defined.

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({
    message:
      error.message || "An unknown error occured.Please try again later.",
  });
});

//Connect to the database & start the server
mongoose
  .connect(process.env.MONGO_CLUSTER_URL)
  .then(() => {
    console.log("Connected to database");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch(() => {
    console.log("Connection failed");
  });

// Access specific collection in MongoDB
const db = mongoose.connection;
db.once("open", () => {
  const collection = db.collection("Hools");
  // Perform operations on the collection
  console.log("Collection opened");

  
});
