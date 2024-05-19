

//const model = "https://hools.onrender.com";
const model = "http://localhost:5000";


const getUpcomingMatches = async () => {
  //Demonstration values
  const from_date = "24_04_24";
  const to_date = "15_05_24";

  const response = await fetch(model+`/matches/date/${from_date}/${to_date}`);
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
    const home = match.home_team;
    const away = match.away_team;
    const durationtxt = match.match_status;
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
  // Create a new div for the matchcard
  const matchcard = document.createElement('div');
  matchcard.className = "matchcard";

  const a = document.createElement('a');
  if (scoretxt != "null - null") {
    a.href = `match.html?match=${match_id}`;
  }
  else
  {
    matchcard.style.pointerEvents = "none";
  }
  a.style.textDecoration = "none";
  a.style.color = "var(--text)";

  // Create divs for the home team, score, away team, duration, and date
  const homeDiv = document.createElement('div');
  homeDiv.className = "team";
  const homeImg = document.createElement('img');
  homeImg.src = home.logo;
  homeImg.alt = home.name;
  const homeSpan = document.createElement('span');
  homeSpan.textContent = home.name;
  homeDiv.appendChild(homeImg);
  homeDiv.appendChild(homeSpan);

  const scoreDiv = document.createElement('div');
  scoreDiv.className = "score";
  const scoreSpan = document.createElement('span');
  if (scoretxt ===  "null - null" ) {
    scoretxt = " 0 - 0 ";
  }
  scoreSpan.textContent = ` ${scoretxt} `;
  scoreDiv.appendChild(scoreSpan);

  const awayDiv = document.createElement('div');
  awayDiv.className = "team";
  const awayImg = document.createElement('img');
  awayImg.src = away.logo;
  awayImg.alt = away.name;
  const awaySpan = document.createElement('span');
  awaySpan.textContent = away.name;
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
  dateSpan.textContent = ` ${new Date(datetxt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} `;
  dateDiv.appendChild(dateSpan);

  const show_more = document.createElement('button');
  const span = document.createElement('span');
  span.textContent = "Show more";
  show_more.appendChild(span);
  show_more.className = "show-more";
  show_more.addEventListener("click", () => {
    window.location.href = `match.html?match=${match_id}`;
  });


  // Append all divs to the matchcard
  matchcard.appendChild(homeDiv);
  matchcard.appendChild(scoreDiv);
  matchcard.appendChild(awayDiv);
  matchcard.appendChild(durationDiv);
  matchcard.appendChild(dateDiv);
  matchcard.appendChild(show_more);

  // Append the matchcard to the anchor element
  a.appendChild(matchcard);
  // Select the div with class "matchtable"
  const matchtable = document.querySelector('.matchtable');

  // Append the anchor element to the matchtable div
  matchtable.appendChild(a);
};

getUpcomingMatches();
