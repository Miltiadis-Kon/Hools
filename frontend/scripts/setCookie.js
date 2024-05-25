//const model = "http://localhost:5000";
const model = "https://hools.onrender.com";

// Set up the cookie functions
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Check if the user is logged in
function isLoggedIn() {
    var username = getCookie("username");
    return !!username; // Returns true if the "username" cookie exists, indicating that the user is logged in
}
// Get the value of a cookie
function getCookie(name) {
    var cookieName = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(";");

    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}

// Set a global variable to track if the user is logged in
var isLoggedInGlobal = isLoggedIn();

const getClub = async (club) => {
    const response = await fetch(model + `/clubs/${club}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (!data) {
        throw new Error("No data found");
    }
    const  _club = data._club[0];
//Display fovourite clubs on the page
const headerView = document.querySelector(".avatar");
const ref = document.createElement("a");
ref.href = `team.html?club=${_club.footballAPI_id}`;
const favIcon = document.createElement("img");
favIcon.src = _club.logo;
favIcon.alt = _club.name;
favIcon.style = "width: 30px; height: 30px; margin: 5px;";
ref.appendChild(favIcon);
headerView.insertBefore(ref, headerView.firstChild);
};

// Render favorite clubs on top of page
async function addFavoriteClubs() {
    // Get the user ID
    var email = getCookie("email");
    // Get the user's favorite clubs
    const response = await fetch(model + `/users/getuser/${email}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (!data) {
        throw new Error("No data found");
    }
    const favClubs = data.user.clubs;
    // Add a red heart to the favorite clubs
    favClubs.forEach((club) => {
        getClub(club);
    });
}

// Get the value of the "username" cookie
var username = getCookie("username");
var userID = getCookie("userID");
var email = getCookie("email");
var avatar = getCookie("avatar");


// Change the layout of the avatar based on whether the user is logged in
const changeAvatarLayout = () => {
    if (isLoggedInGlobal) {
        document.querySelector('.avatar a h2').textContent = username;
        document.getElementById("avatarimg").src = avatar;
    } else {
        document.querySelector('.avatar a h2').textContent = "Sign In";
        document.querySelector('.avatar a').style = "text-decoration: none;"
        document.querySelector('.avatar a h2').style = "color: var(--text);"
        document.querySelector('.avatar a').href = "/frontend/signin.html";
    }
};

// Delete cookies
// setCookie("username", "", -1);
// setCookie("userID", "", -1);
// setCookie("email", "", -1);
// setCookie("avatar", "", -1);

//Set cookies
// setCookie("username", "John Doe", 7);
// setCookie("userID", "1", 7);
// setCookie("email", "admin@admin.com", 7);


// Check if the user is logged in and display the username and user ID in the console 
if (isLoggedInGlobal) {
    addFavoriteClubs();
    changeAvatarLayout();
} else {
    // Change the layout of the avatar if the user is not logged in
    const headerView = document.querySelector(".avatar");
    const secondChild = headerView.children[1];
    secondChild.href = "/frontend/signin.html";
    secondChild.style = "text-decoration: none;";
    secondChild.textContent = "";
    const h2 = document.createElement("h2");
    h2.style= style="margin: 0px 20px; color: var(--text);"
    h2.textContent = "Sign In";
    secondChild.appendChild(h2);
}

//Show user settings
document.getElementById("avatarimg").addEventListener("click", () => {
    const settings= document.querySelector(".user-settings");
    if (settings.style.display === "none") {
        settings.style.display = "flex";
    }
    else settings.style.display = "none";
    settings.addEventListener("click", () => {
        window.location.href = "/frontend/signin.html";
    });
});