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
    const durationtxt = match.duration;
    const scoretxt = match.score;
    const datetxt = match.date;
   createMatchcard(match_id,home, scoretxt, away,durationtxt, datetxt);
  });
};

//TODO: Create matchcard
const createMatchcard = (match_id, home, scoretxt, away, durationtxt, datetxt) => {
  // Create a new anchor element
  console.log(match_id,home, scoretxt, away, durationtxt, datetxt);
  //ref.href = `match.html?club=${match_id}`;
  const a = document.createElement('a');
  a.href = `match.html?match=${match_id}`;
  a.target = "_blank";
  a.style.textDecoration = "none";
  a.style.color = "var(--text)";

  // Create a new div for the matchcard
  const matchcard = document.createElement('div');
  matchcard.className = "matchcard";

  // Create divs for the home team, score, away team, duration, and date
  const homeDiv = document.createElement('div');
  homeDiv.className = "team";
  const homeImg = document.createElement('img');
  homeImg.src = `./images/${home}.png`;
  homeImg.alt = home;
  const homeSpan = document.createElement('span');
  homeSpan.textContent = home;
  homeDiv.appendChild(homeImg);
  homeDiv.appendChild(homeSpan);

  const scoreDiv = document.createElement('div');
  scoreDiv.className = "score";
  const scoreSpan = document.createElement('span');
  scoreSpan.textContent = ` ${scoretxt} `;
  scoreDiv.appendChild(scoreSpan);

  const awayDiv = document.createElement('div');
  awayDiv.className = "team";
  const awayImg = document.createElement('img');
  awayImg.src = `./images/${away}.png`;
  awayImg.alt = away;
  const awaySpan = document.createElement('span');
  awaySpan.textContent = away;
  awayDiv.appendChild(awaySpan);
  awayDiv.appendChild(awayImg);

  const durationDiv = document.createElement('div');
  durationDiv.className = "duration";
  const durationSpan = document.createElement('span');
  durationSpan.textContent = ` ${durationtxt} `;
  durationDiv.appendChild(durationSpan);

  const dateDiv = document.createElement('div');
  dateDiv.className = "date";
  const dateSpan = document.createElement('span');
  dateSpan.textContent = ` ${datetxt} `;
  dateDiv.appendChild(dateSpan);

  // Append all divs to the matchcard
  matchcard.appendChild(homeDiv);
  matchcard.appendChild(scoreDiv);
  matchcard.appendChild(awayDiv);
  matchcard.appendChild(durationDiv);
  matchcard.appendChild(dateDiv);

  // Append the matchcard to the anchor element
  a.appendChild(matchcard);
  // Select the div with class "matchtable"
  const matchtable = document.querySelector('.matchtable');

  // Append the anchor element to the matchtable div
  matchtable.appendChild(a);
};

getUpcomingMatches();
