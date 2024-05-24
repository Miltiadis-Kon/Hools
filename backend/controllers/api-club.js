const HttpError = require("../models/http-errors.js");
const request = require("request");
const clubModel = require("../models/club.js");

//TODO: Implment user functions,cookies & redierect code
//TODO: Implement 404 error page 

const getClubfromAPI = async (req, res, next) => {
  const club_id = req.params.club_id;
};

const getClubsfromAPI = async (req, res, next) => {
  const league_id = req.params.league_id;
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/teams",
    qs: { league: league_id, season: "2023" },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    // Parse JSON body
    const jsonBody = JSON.parse(body);
    const club_data = jsonBody.response;
    if (response == null) {
      const error = new HttpError("Could not find any clubs.", 404);
      return next(error);
    }
    club_data.map((club) => {
      clubModel.find({ name: club.team.name }).then(function (err, docs) {
        if (err) {
          const added_club = new Club(
            club.team.id,
            club.team.name,
            club.team.logo,
            club.team.founded,
            club.venue.name,
            club.venue.capacity,
            club.venue.image
          );
          // Save to database
          clubModel.insertMany(added_club).then(function (err, docs) {
            if (err) {
              return console.error(err);
            } else {
              console.log(`Added club: ${added_club} to MongoDB successfully.`);
            }
          });
        } else {
          console.log(`Club: ${club.team.name} already exists in MongoDB.`);
        }
      });
    });
  });
};

const deleteAllClubs = async (req, res, next) => {
  clubModel.deleteMany({}); // delete all clubs from the database
  res.json({ message: "All clubs deleted." });
};


//CLUB RELATED ENDPOINTS
exports.getClubsfromAPI = getClubsfromAPI;
exports.getClubfromAPI = getClubfromAPI;
exports.deleteAllClubs = deleteAllClubs;




class Club {
  constructor(
    name,
    footballAPI_id,
    logo,
    founded,
    field_name,
    field_capacity,
    field_img,
    tickets_link,
    players,
    leagueStanding,
    matches,
    next_match,
    coach
  ) {
    this.footballAPI_id = footballAPI_id;
    this.name = name;
    this.logo = logo;
    this.founded = founded;
    this.field_name = field_name;
    this.field_capacity = field_capacity;
    this.field_img = field_img;
    this.tickets_link = tickets_link;
    this.players = players;
    this.leagueStanding = leagueStanding;
    this.matches = matches;
    this.next_match = next_match;
    this.coach = coach;
  }
}
