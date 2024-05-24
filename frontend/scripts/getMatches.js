

const model = "https://hools.onrender.com";
//const model = "http://localhost:5000";

const radioInput = document.querySelector('input[name="radioName"]:checked');
const radioValue = radioInput ? radioInput.value : null;

let _matches = [];
// Get data from the API
const getUpcomingMatches = async (from_date,to_date) => {
   // Get the date range based on the selected radio button
    let from_date_init = new Date();
   from_date_init.setMonth(from_date_init.getMonth() - 2); // 2 months ago
   from_date = from_date_init.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replaceAll('/', '_');
   to_date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replaceAll('/', '_');


  const response = await fetch(model+`/matches/date/${from_date}/${to_date}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (!data) {
    throw new Error("No data found");
  }
  _matches = data.recent_matches;
  displayMatches(data);
};

const displayMatches = (data) => {
  const matches = data.recent_matches;
  matches.sort((a, b) => new Date(b.date) - new Date(a.date));
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

// Get all radio buttons
const radioButtons = document.querySelectorAll('.radio-input input[type="radio"]');

// Add click event listener to each radio button
radioButtons.forEach(radioButton => {
  radioButton.addEventListener('click', function() {
    changeDisplayedMatches(this.value);
  });
});

// Function to change displayed matches
async function changeDisplayedMatches(value) {  
  const matchtable = document.querySelector('.matchtable');
  switch(value) {
    case 'value-1':
      console.log("Showing upcoming matches");
      // Code to display upcoming matches
      matchtable.querySelectorAll('.matchcard').forEach(card => {
        console.log(card.querySelector('.duration span').textContent);
        if(card.querySelector('.duration span').textContent !== " NS ") {
          console.log(card.querySelector('.duration').textContent);
          card.style.display = 'none';
        }
        else {
          card.style.display = 'flex';
        }
      });
      break;
    case 'value-2':
      console.log("Showing recent matches");
      // Code to display recent matches
      const latest_accepted_date = new Date();
      latest_accepted_date.setDate(latest_accepted_date.getDate() - 7);

      matchtable.querySelectorAll('.matchcard').forEach(card => {

        let card_date = card.querySelector('.date span').textContent;
        let [datePart, timePart] = card_date.split(', ');
        let [day, month, year] = datePart.split('/');
        let [hour, minute] = timePart.split(':');
        
        // JavaScript counts months from 0, so subtract 1 from the month
        let card_date_object = new Date(year, month - 1, day, hour, minute);

        if(card_date_object < latest_accepted_date) {
          card.style.display = 'none';
        }
        else {
          card.style.display = 'flex';
        }
      }
      );
      break;
    case 'value-3':
      console.log("Showing completed matches");
      // Code to display completed matches
      matchtable.querySelectorAll('.matchcard').forEach(card => {
        if(card.querySelector('.duration span').textContent !== " FT ") {
          card.style.display = 'none';
        }
        else {
          card.style.display = 'flex';
        }
      });
      break;
    default:
      // Code to display completed matches
      matchtable.querySelectorAll('.matchcard').forEach(card => {
        card.style.display = 'flex';
      });
      break;
  }
}

// Initial call to changeDisplayedMatches
getUpcomingMatches();
