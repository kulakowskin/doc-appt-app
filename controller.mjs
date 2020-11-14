//import {Calendar} from "./node_modules/@fullcalendar/core";

//import * as FullCalendar from "fullcalendar";

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
    if(tab_name === "schedule.html") {
        loadCalendar();
    }
}

var currentUser = "";

//loggedin or loggedout
function setCookie(user) {
    document.cookie = "user="+user+";";
}

function getCookie(){
    return document.cookie.split(';').some(c => {
        return c.trim().startsWith('user=');
    });
}

if(isLoggedIn()){
    jQuery(document).ready(function(){
        makeActive("schedule.html",document.getElementById("scheduletab"));
        let elems = document.getElementsByClassName("loggedin");
        for(var i=0;i<elems.length; i++)
        {
                elems[i].style.display = "block";
        }
    });

}
else {
    jQuery(document).ready(function(){
        jQuery("#tab").load("signin.html");
    });
}

function isLoggedIn() {
    var res = getCookie();
    return res;
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
                let elems = document.getElementsByClassName("loggedin");
                for(var i=0;i<elems.length; i++)
                {
                    elems[i].style.display = "block";
                }
                makeActive('schedule.html',document.getElementById("scheduletab"));
            });
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
        let elems = document.getElementsByClassName("loggedin");
        for(var i=0;i<elems.length; i++)
        {
            elems[i].style.display = "none";
        }
    });
}

function loadCalendar() {
    // var calendarEl = document.getElementById("calendar");
    // var calendar = new FullCalendar.Calendar(calendarEl,
    //     {
    //         timezone: 'local',
    //         events: [
    //         {
    //             title: 'new event',
    //             start: '2020-11-15'
    //         },
    //         ],
    //         color: 'lightBlue',
    //         textColor: 'gray',
    //         header: {
    //         left: 'title',
    //             center: '',
    //             right: 'today prev,next'
    //         },
    //         buttonIcons: {
    //             prev: 'left-single-arrow',
    //                 next: 'right-single-arrow',
    //         },
    //     });
    // calendar.render();
}
