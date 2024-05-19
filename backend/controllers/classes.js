//Classes
class League {
    constructor(id, name, country, logo, flag, season) {
      this.footballAPI_id = id;
      this.name = name;
      this.country = country;
      this.logo = logo;
      this.flag = flag;
      this.season = season;
    }
  }
  class Standings {
    constructor(
      rank,
      teamId,
      teamName,
      teamLogo,
      points,
      played,
      wins,
      defeats,
      losses,
      goaldiff,
      form
    ) {
      this.rank = rank;
      this.teamId = teamId;
      this.teamName = teamName;
      this.teamLogo = teamLogo;
      this.points = points;
      this.played = played;
      this.wins = wins;
      this.defeats = defeats;
      this.losses = losses;
      this.goaldiff = goaldiff;
      this.form = form;
    }
  }
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
  class Match {
    constructor(
      footballAPI_id,
      date,
      time,
      referee,
      venue,
      match_status,
      score,
      home_team,
      home_scorers,
      home_statistics,
      home_formation,
      home_lineup,
      home_substitutes,
      away_team,
      away_scorers,
      away_statistics,
      away_formation,
      away_lineup,
      away_substitutes
    ) {
      this.footballAPI_id = footballAPI_id;
      this.home_team = home_team;
      this.away_team = away_team;
      this.score = score;
      this.date = date;
      this.time = time;
      this.venue = venue;
      this.home_statistics = home_statistics;
      this.away_statistics = away_statistics;
      this.home_scorers = home_scorers;
      this.away_scorers = away_scorers;
      this.home_lineup = home_lineup;
      this.away_lineup = away_lineup;
      this.home_substitutes = home_substitutes;
      this.away_substitutes = away_substitutes;
      this.home_formation = home_formation;
      this.away_formation = away_formation;
      this.match_status = match_status;
      this.referee = referee;
    }
  }