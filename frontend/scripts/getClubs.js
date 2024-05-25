const club_home_template = document.querySelector("[club-home-template]");

const club_home_container = document.querySelector("[club-home-container]");

const search_input = document.querySelector("[search-input]");

search_input.addEventListener("input", (e) => {
  const search = e.target.value.toLowerCase();
  const clubs = club_home_container.querySelectorAll("[club-name]");
  clubs.forEach((club) => {
    const clubName = club.textContent.toLowerCase();
    if (clubName.includes(search)) {
      club.parentElement.style.display = "block";
    } else {
      club.parentElement.style.display = "none";
    }
  });
});

//Function to get the data from the DB
const getTeams = async () => {
  const response = await fetch(model + "/clubs");
  const data = await response.json();
  //console.log(data);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (!data) {
    throw new Error("No data found");
  }
  //Loop through the data and display it on the page
  let i = 0;
  data.clubs.map(async (team) => {
    if (i > 3) return;
    i++;
    const clubHome = club_home_template.content.cloneNode(true);
    clubHome.querySelector("[club-name]").textContent = team.name;
    var img = clubHome.querySelector("[club-image] img");
    img.src = team.logo;
    img.alt = team.name;
    var alt = clubHome.querySelector("[club-image]  a");
    alt.href = `team.html?club=${team.footballAPI_id}`;
    let favClubs = [];
    if (isLoggedInGlobal) {
      //Get user ID
      const userID = getCookie("email");
      //If user is signed in, check if club is already in favorites
      const response = await fetch(model + `/users/getuser/${userID}`);
      const data = await response.json();
      if (!response.ok) {
        //club_home_container.appendChild(clubHome);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (!data) {
        throw new Error("No data found");
      }
      favClubs = data.user.clubs;
      //If club is in favorites, add a red heart
      if (favClubs.includes(team.footballAPI_id)) {
        clubHome
          .querySelector("#favoriteClub")
          .querySelector("#imgHeart")
          .classList.add("active");
      }
    }
    clubHome
      .querySelector("#favoriteClub")
      .addEventListener("click", async (e) => {
        const parent = e.target.parentElement;
        let favClub = parent.querySelector("#imgHeart");
        //Check if user is signed in
        if (isLoggedInGlobal) {
          if (favClubs.includes(team.footballAPI_id)) {
            console.log("Club already in user");
            const response = await fetch(
              model + `/users/removeclub/${userID}/${team.footballAPI_id}`
            );
            const data = await response.json();
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (!data) {
              throw new Error("No data found");
            }
            favClub.classList.remove("active");
            // Remove from top bar 
            const headerView = document.querySelector(".avatar");
            const ref = headerView.querySelector(`a[href="team.html?club=${team.footballAPI_id}"]`);
            headerView.removeChild(ref);
            return;
          } else {
            const response = await fetch(
              model + `/users/addclub/${userID}/${team.footballAPI_id}`
            );
            const data = await response.json();
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (!data) {
              throw new Error("No data found");
            }
            favClub.classList.add("active");
            // Add to top bar
            const headerView = document.querySelector(".avatar");
            const ref = document.createElement("a");
            ref.href = `team.html?club=${team.footballAPI_id}`;
            const favIcon = document.createElement("img");
            favIcon.src = team.logo;
            favIcon.alt = team.name;
            favIcon.style = "width: 30px; height: 30px; margin: 5px;";
            ref.appendChild(favIcon);
            headerView.insertBefore(ref, headerView.firstChild);
          }
          return;
        }
        //If user is not signed in, add an alert to sign in
        else {
          alert("Please sign in to add a favorite club!");
        }
      });

    club_home_container.appendChild(clubHome);
    return { name: team.name, logo: team.logo };
  });
};

const showFavoriteClubs = async () => {
  const userID = getCookie("email");
  const response = await fetch(model + `/users/getuser/${userID}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (!data) {
    throw new Error("No data found");
  }
  const favClubs = data.user.clubs;
  console.log(favClubs);
};

getTeams();
showFavoriteClubs();
