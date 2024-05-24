function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function isLoggedIn() {
    var username = getCookie("username");
    return !!username; // Returns true if the "username" cookie exists, indicating that the user is logged in
}

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

// Check if the user is logged in
if (isLoggedInGlobal) {
    console.log("User is logged in");
    console.log("Username: " + getCookie("username"));
    console.log("User ID: " + getCookie("userID"));
} else {
    console.log("User is not logged in");
}

// Set a cookie named "username" with the value "John Doe" that expires in 7 days
//setCookie("username", "John Doe", 7);

// Get the value of the "username" cookie
var username = getCookie("username");
var userID = getCookie("userID");
var email = getCookie("email");
var avatar = getCookie("avatar");



const randomAvatarImages = [
"https://api.dicebear.com/8.x/personas/svg?seed=Bella",
"https://api.dicebear.com/8.x/personas/svg?seed=Felix",
"https://api.dicebear.com/8.x/personas/svg?seed=Jasper",
"https://api.dicebear.com/8.x/personas/svg?seed=Bubba",
"https://api.dicebear.com/8.x/personas/svg?seed=Gizmo",
"https://api.dicebear.com/8.x/personas/svg?seed=Abby"
]

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
//setCookie("username", "", -1);
//setCookie("userID", "", -1);
//setCookie("email", "", -1);
//setCookie("avatar", "", -1);

//Set cookies
setCookie("username", "John Doe", 7);
setCookie("userID", "1", 7);
setCookie("email", "admin@admin.com", 7);
setCookie("avatar", randomAvatarImages[Math.floor(Math.random() * randomAvatarImages.length)], 7);

changeAvatarLayout();
