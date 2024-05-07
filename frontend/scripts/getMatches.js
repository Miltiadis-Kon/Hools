const getUpcomingMatches = async () => {
  //Demonstration values
  const from_date = "24_04_24";
  const to_date = "15_05_24";

  const response = await fetch(`http://localhost:5000/matches/date/${from_date}/${to_date}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (!data) {
    throw new Error("No data found");
  }
  displayMatches(data);
};

const displayMatches = (data) => {
  const matches = data.recent_matches;
  matches.forEach(match => {
    const match_id = match.footballAPI_id;
    const home = match.home_team.name;
    const away = match.away_team.name;
    const scoretxt = match.score;
    const datetxt = match.date;
   createMatchcard(home, scoretxt, away, datetxt);
  });
};

//TODO: Create matchcard
const createMatchcard = (match_id,home, scoretxt, away, durationtxt, datetxt) => {
  console.log(match_id,home, scoretxt, away, durationtxt, datetxt);
  //ref.href = `match.html?club=${match_id}`;
};

getUpcomingMatches();
