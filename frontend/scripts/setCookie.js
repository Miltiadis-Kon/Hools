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

// Delete cookies
//setCookie("username", "", -1);
//setCookie("userID", "", -1);

//Set cookies
setCookie("username", "John Doe", 7);
setCookie("userID", "1", 7);
setCookie("email", "admin@admin.com", 7);
