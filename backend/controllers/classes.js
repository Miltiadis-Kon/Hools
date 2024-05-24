//Classes
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