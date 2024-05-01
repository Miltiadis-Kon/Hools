const getUpcomingMatches = async () => {
  const response = await fetch("http://localhost:5000/upcomingmatches");
  const data = await response.json;
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (!data) {
    throw new Error("No data found");
  }
  console.log(data);
  for (let i = 0; i < 16; i++) {
    let team_data = data.league.standings.team;
    console.log(team_data);
  }
};

const createMatchcard = (home, scoretxt, away, durationtxt, datetxt) => {
  const matchCard = document.createElement("div");
  matchCard.className = "matchcard";

  // Create team 1 div
  const team1 = document.createElement("div");
  team1.className = "team";
  const img1 = document.createElement("img");
  img1.src = home.logo;
  img1.alt = "home";
  const span1 = document.createElement("span");
  span1.textContent = home.title;
  team1.appendChild(img1);
  team1.appendChild(span1);

  // Create score div
  const score = document.createElement("div");
  score.className = "score";
  const scoreSpan = document.createElement("span");
  scoreSpan.textContent = scoretxt; // \u00A0 is a non-breaking space
  score.appendChild(scoreSpan);

  // Create team 2 div
  const team2 = document.createElement("div");
  team2.className = "team";
  const span2 = document.createElement("span");
  span2.textContent = away.title;
  const img2 = document.createElement("img");
  img2.src = away.logo;
  img2.alt = "away";
  team2.appendChild(span2);
  team2.appendChild(img2);

  // Create duration div
  const duration = document.createElement("div");
  duration.className = "duration";
  const durationSpan = document.createElement("span");
  durationSpan.textContent = durationtxt;
  duration.appendChild(durationSpan);

  // Create date div
  const date = document.createElement("div");
  date.className = "date";
  const dateSpan = document.createElement("span");
  dateSpan.textContent = datetxt;
  date.appendChild(dateSpan);

  // Append all divs to main div
  matchCard.appendChild(team1);
  matchCard.appendChild(score);
  matchCard.appendChild(team2);
  matchCard.appendChild(duration);
  matchCard.appendChild(date);

  // Append main div to body or other container
  document.body.appendChild(matchCard);
};

getUpcomingMatches();
