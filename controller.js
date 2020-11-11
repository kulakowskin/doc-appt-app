
function makeActive(tab_name, element) {
    try
    {
        var elem = document.getElementsByClassName("active");
        elem[0].classList.remove("active");
    }
    catch (e) {
        console.log(e);
    }
    element.classList.add("active");
    jQuery(document).ready(function () {
        jQuery("#tab").load(tab_name);
    });
}

var currentUser = "";

//loggedin or loggedout
function setCookie(user) {
    document.cookie = "user="+user+";"
}

function getCookie(){
    var comp = "user=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1,c.length);
        if (c.indexOf(comp) === 0) return c.substring(comp.length,c.length);
    }
    return null;
}

if(isLoggedIn()){
    jQuery(document).ready(function(){
        jQuery("#tab").load("schedule.html");
    });
}
else {
    jQuery(document).ready(function(){
        jQuery("#tab").load("signin.html");
    });
}

function isLoggedIn() {
    return (getCookie());
}

function createAccount(){
    jQuery(document).ready(function () {
        jQuery("#tab").load("Account.html");
    });
}

function login(){
    // call to DB to verify password matches user
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    verifyPassword(email, password, function(res) {
        if (res){
            // call to DB to verify password matches user
            currentUser = email;
            setCookie(currentUser);
            jQuery(document).ready(function () {
                jQuery("#tab").load("schedule.html");
            });
            document.getElementById("logoutbtn").style.display = "block";
        }
        else {
            document.getElementById("error").innerHTML = "Username or password is incorrect";
        }
    });
}

function verifyPassword(username, pword, callback) {
    getUser(username, function(user){
        if (user.password === pword) {
            callback(true);
        }
        else{
            callback(false);
        }
    });

}

function logout() {
    setCookie("");
    jQuery(document).ready(function(){
        jQuery("#tab").load("signin.html");
    });
    document.getElementById("logoutbtn").style.display = "none";
}
