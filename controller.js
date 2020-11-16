
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
        jQuery("#tab").load(tab_name, function() {
            if(tab_name === "schedule.html") {
                loadCalendar(events);
                populateProviderDropdown();
            }
        });

    });

}

var currentUser = "";
var events = [];

//loggedin or loggedout
function setCookie(user) {
    document.cookie = "user="+user+";";
}

function getCookie(){
    return !(document.cookie === "user=");
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
    console.log("cookie: ",res);
    return res;
}

function createAccount(){
    jQuery(document).ready(function () {
        jQuery("#tab").load("Account.html");
    });

}

async function login(){
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

async function verifyPassword(username, pword, callback) {
    await getUser(username, function(user){
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

function loadCalendar(events) {
    var calendarEl = document.getElementById("calendar");
    var calendar = new FullCalendar.Calendar(calendarEl,
        {
            timezone: 'local',
            events: events,
            color: 'lightBlue',
            textColor: 'gray',
            header: {
            left: 'title',
                center: '',
                right: 'today prev,next'
            },
            buttonIcons: {
                prev: 'left-single-arrow',
                    next: 'right-single-arrow',
            },
            schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
            initialView: 'dayGridMonth',
            dateClick: function(info) {
                alert('Clicked on: ' + info.dateStr);
                alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
                alert('Current view: ' + info.view.type);
                // change the day's background color just for fun
                info.dayEl.style.backgroundColor = 'red';
            }
        }).render();
}

function populateProviderDropdown(){
    var dropdown = document.getElementById("doctors");
    getAllProviders(function(providers){
        dropdown.innerHTML += "<option value='select'>Select doctor...</option>";
        providers.forEach(p => dropdown.innerHTML += "<option value='"+p.username+"'>Dr. "+p.last+"</option>");
    });
}

function pullProviderCalendar(){

    var p_events = [];
    var p_email = document.getElementById("doctors").value;
    getUser(p_email, function(user){
        getSchedule(user.scheduleid, function(sched) {
            sched.appointments.forEach(a => {
                p_events.push({
                    title: 'Available',
                    start: new Date(a.date)
                })
            });
            loadCalendar(p_events);
        });
    });

}