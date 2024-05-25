const model = "http://localhost:5000";
//const model = "https://hools.onrender.com";

//Initialize functions
const getClubs = async () => {
  const response = await fetch(model + "/clubs");
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (!data) {
    throw new Error("No data found");
  }

  // Manipulate data to show the corrent amount of information
  data.clubs = data.clubs.slice(0, 4);

  data.clubs.forEach((club) => {
    club.players = club.players[0];
  });

  renderJson({ data: data });
};

const getNextAndPreviousMatches = async () => {
  const clubRequest = await fetch(model + "/clubs");
  const clubData = await clubRequest.json();
  if (!clubRequest.ok) {
    throw new Error(`HTTP error! status: ${clubRequest.status}`);
  }
  if (!clubData) {
    throw new Error("No data found");
  }
  //get matches for each club
  clubData.clubs.forEach(async (club) => {
    const clubID = club.footballAPI_id;
    if(isNaN(parseInt(clubID)) ){
      throw new Error(`Invalid club ID!`);
    }
    console.log(clubID);
    const nextMatchRequest = await fetch(
      model + `/footballAPI/next_match/197/${clubID}`
    );
    const nextMatchData = await nextMatchRequest.json();
    if (!nextMatchRequest.ok) {
      throw new Error(`HTTP error! status: ${nextMatchRequest.status}`);
    }
    if (!nextMatchData) {
      throw new Error("No data found");
    }
    console.log(nextMatchData);
    const lastMatchRequest = await fetch(
      model + `/footballAPI/last_match/197/${clubID}`
    );
    const lastMatchData = await lastMatchRequest.json();
    if (!lastMatchRequest.ok) {
      throw new Error(`HTTP error! status: ${lastMatchRequest.status}`);
    }
    if (!lastMatchData) {
      throw new Error("No data found");
    }
    console.log(lastMatchData);
  });
};

const getclubByID = async (clubID) => {
  if(isNaN(parseInt(clubID)) ){
    throw new Error(`Invalid club ID!`);
  }
  const response = await fetch(model + `/clubs/${clubID}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (!data) {
    throw new Error("No data found");
  }

  // Manipulate data to show the corrent amount of information
  data._club = data._club[0];
  data._club.players = data._club.players.length;

  renderJson({ data: data });
};

const getPlayersandCoach = async () => {
  if(isNaN(parseInt(clubID)) ){
    throw new Error(`Invalid club ID!`);
  }
  const response = await fetch(model + `/footballAPI/players/${clubID}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (!data) {
    throw new Error("No data found");
  }
  renderJson({ data: data });
};

const setUpClubs = async () => {
  // Delete clubs on DB
  let respnses = [];
  const deleteResponse = await fetch(model + `/footballAPI/deleteAllClubs`);
  const data = await deleteResponse.json();
  if (!deleteResponse.ok) {
    throw new Error(`HTTP error! status: ${deleteResponse.status}`);
  }
  if (!data) {
    throw new Error("No data found");
  }

  respnses.push({ message: "Clubs deleted", data: data });

  //Get teams based on league
  const getteamsresponse = await fetch(
    model + `/footballAPI/clubfromleague/197`
  );
  const teams = await getteamsresponse.json();
  if (!getteamsresponse.ok) {
    throw new Error(`HTTP error! status: ${getteamsresponse.status}`);
  }
  if (!teams) {
    throw new Error("No teams found!");
  }

  respnses.push({ message: "Teams fetched", data: teams.length });

  const clubs = teams.clubs;
  let club_ids = [];
  clubs.forEach((club) => {
    club_ids.push(club.team.id);
  });

  console.log(club_ids);
  //Get players and coach for each team

  for (let i = 0; i < club_ids.length; i++) {
    const clubID = club_ids[i];
    const getPlayersResponse = await fetch(
      model + `/footballAPI/players/${clubID}`
    );
    const players = await getPlayersResponse.json();
    if (!getPlayersResponse.ok) {
      throw new Error(`HTTP error! status: ${getPlayersResponse.status}`);
    }
    if (!players) {
      throw new Error("No players found");
    }

    respnses.push({
      message: `Players fetched for club ${clubID}`,
      data: players,
    });

    // Get next match
    const getNextMatchResponse = await fetch(
      model + `/footballAPI/nextmatch/197/${clubID}`
    );
    const nextMatch = await getNextMatchResponse.json();
    if (!getNextMatchResponse.ok) {
      throw new Error(`HTTP error! status: ${getNextMatchResponse.status}`);
    }
    if (!nextMatch) {
      throw new Error("No next match found");
    }

    respnses.push({
      message: `Next match fetched for club ${clubID}`,
      data: nextMatch,
    });

    //Get last match
    const getLastMatchResponse = await fetch(
      model + `/footballAPI/lastmatch/197/${clubID}`
    );
    const lastMatch = await getLastMatchResponse.json();
    if (!getLastMatchResponse.ok) {
      throw new Error(`HTTP error! status: ${getLastMatchResponse.status}`);
    }
    if (!lastMatch) {
      throw new Error("No last match found");
    }

    respnses.push({
      message: `Last match fetched for club ${clubID}`,
      data: lastMatch,
    });
  }

  renderJson({
    data: { message: `Players fetched for club ${clubID}`, data: respnses },
  });
};

const call = async (path) => {
  const response = await fetch(model + path);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (!data) {
    throw new Error("No data found");
  }
  renderJson({ data: data });
};

const callwithID = async (path, id) => {
  const response = await fetch(model + path + id);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (!data) {
    throw new Error("No data found");
  }
  renderJson({ data: data });
};

// Get all radio buttons
const radioButtons = document.querySelectorAll(
  '.radio-input input[type="radio"]'
);

// Add click event listener to each radio button
radioButtons.forEach((radioButton) => {
  radioButton.addEventListener("click", function () {
    changeDisplayedAPISettings(this.value);
  });
});

// Function to change the displayed API settings
function changeDisplayedAPISettings(value) {
  const clubSettings = document.getElementById("club-functions");
  const matchSettings = document.getElementById("match-functions");
  const userSettings = document.getElementById("user-functions");

  switch (value) {
    case "value-1":
      clubSettings.style.display = "block";
      matchSettings.style.display = "none";
      userSettings.style.display = "none";
      break;
    case "value-2":
      clubSettings.style.display = "none";
      matchSettings.style.display = "block";
      userSettings.style.display = "none";
      break;
    case "value-3":
      clubSettings.style.display = "none";
      matchSettings.style.display = "none";
      userSettings.style.display = "block";
      break;
    default:
      clubSettings.style.display = "block";
      matchSettings.style.display = "none";
      userSettings.style.display = "none";
      break;
  }
}

function renderJson({ data, depth = 0 } = {}) {
    return;
  const root = document.querySelector(".response-content");
  if (depth == 0 && root == "") {
    const pre = document.createElement("pre");
    const ul = document.createElement("ul");

    pre.appendChild(ul);
    root = ul;
    document.body.appendChild(pre);
  } else {
    root.innerHTML = "";
  }

  for (d in data) {
    if (typeof data[d] == "object" && data[d] != null) {
      const nestedData = data[d];

      const detailsElement = document.createElement("details");
      const summaryEl = document.createElement("summary");
      summaryEl.classList.add("titleStyle");

      detailsElement.appendChild(summaryEl);

      let appendedString = Array.isArray(data[d])
        ? `Array, ${data[d].length}`
        : "Object";

      summaryEl.innerHTML = `${d} <span class="titleStyleDescription">(${appendedString})<span></summary>`;

      const newRoot = document.createElement("ul");

      detailsElement.appendChild(newRoot);

      root.appendChild(detailsElement);

      summaryEl.addEventListener("click", () => {
        if (!detailsElement.hasAttribute("open")) {
          renderJson({
            root: newRoot,
            data: nestedData,
            depth: depth + 1,
          });
          clicked = true;
        } else {
          newRoot.innerHTML = "";
        }
      });
    } else {
      let currentType = typeof data[d];
      let el = document.createElement("li");
      let display = null;

      switch (currentType) {
        case "object":
          display = "null";
          break;
        default:
          display = data[d];
          break;
      }

      let titleSpan = document.createElement("span");
      let contentSpan = document.createElement("span");
      let detailsContentSpan = document.createElement("span");

      titleSpan.innerText = `${d}: `;
      titleSpan.classList.add("titleStyle");

      contentSpan.innerText = display;
      contentSpan.classList.add(currentType);

      detailsContentSpan.innerText = `   Type: ${currentType}; Length: ${
        display?.length
      }; Boolean: ${Boolean(display)}`;
      detailsContentSpan.classList.add("moreDetails");

      el.appendChild(titleSpan);
      el.appendChild(contentSpan);
      //el.appendChild(detailsContentSpan)

      root.appendChild(el);
    }
  }
}




//Assign functions to buttons
document.getElementById("getClubs").addEventListener("click", getClubs);
document.getElementById("getClubByID").addEventListener("click", () => {
  const clubID = document.getElementById("getClubByID-input").value;
  getclubByID(clubID);
});
document.getElementById("getPlayersandCoach").addEventListener("click", () => {
  const clubID = document.getElementById("getPlayersandCoach-input").value;
  getPlayersandCoach(clubID);
});

document.getElementById("setUpClubs").addEventListener("click", setUpClubs);

//Set match functions
document.getElementById("getRecentMatches").addEventListener("click", () => {
  call("/footballAPI/recent_matches/197");
});

document.getElementById("getCommingMatches").addEventListener("click", () => {
  call("/footballAPI/upcoming/197");
});

document.getElementById("getlastmatch").addEventListener("click", () => {
  const clubID = document.getElementById("last_match-input").value;
  callwithID("/footballAPI/last_match/197/", clubID);
});

document.getElementById("getnextmatch").addEventListener("click", () => {
  const clubID = document.getElementById("next_match-input").value;
  callwithID("/footballAPI/next_match/197/", clubID);
});

document.getElementById("getstandings").addEventListener("click", () => {
  call("/footballAPI/standings/197/2023");
});

document.getElementById("getNPMatches").addEventListener("click", () => {
  getNextAndPreviousMatches();
});

changeDisplayedAPISettings();
