function combineCalendars(){
    getProviderCalendar(function(p_events){
        getUserCalendar(function(u_events){
            loadCalendar(p_events.concat(u_events));
        })
    })
}

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
                getUserCalendar( function(u_events){
                    loadCalendar(u_events)
                });

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
    var c = document.cookie;
    return c.substring("user=".length,c.length);
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
    var res = !(document.cookie === "user=");
    currentUser = getCookie();
    console.log("cookie: ",currentUser);
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
    currentUser = "";
    jQuery(document).ready(function(){
        jQuery("#tab").load("signin.html");
        let elems = document.getElementsByClassName("loggedin");
        for(var i=0;i<elems.length; i++)
        {
            elems[i].style.display = "none";
        }
    });
}

function loadCalendar(event_arr) {
    var calendarEl = document.getElementById("calendar");
    var calendar = new FullCalendar.Calendar(calendarEl,
        {
            timezone: 'local',
            events: event_arr,
            textColor: 'gray',
            eventDisplay: 'block',
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
            eventClick: function(info) { // TODO don't make event clickable unless it's available
                if(info.event.title === "Available") {
                    info.jsEvent.preventDefault();
                    loadEventModal(info.event);
                }
            }

        }).render();
}

function loadEventModal(event){
    var modal = document.getElementById("modal");

    var span = document.getElementsByClassName("close");

    var select = document.getElementById("doctors");
    var dr = select.options[select.selectedIndex];
    // Load the innertext
    document.getElementById("event-message").innerText = "Schedule appointment with "+dr.text+" at "+event.start+"?";

    Array.prototype.forEach.call(span, function(s){
        s.onclick = function() {
            modal.style.display = "none";
        }}
    );

    document.getElementById("confirm-event-btn").onclick =  function() {
        updateUserSchedule(currentUser, event, dr.value);
        updateUserSchedule(dr.value, event, currentUser);
        modal.style.display = "none";
        combineCalendars();
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(click) {
        if (click.target == modal) {
            modal.style.display = "none";
        }
    };
    document.getElementById("cancel-event-btn").onclick = function(click) {
        modal.style.display = "none";
    };

    modal.style.display = "block";
}

function populateProviderDropdown(){
    var dropdown = document.getElementById("doctors");
    getAllProviders(function(providers){
        dropdown.innerHTML += "<option value='select'>Select doctor...</option>";
        providers.forEach(p => dropdown.innerHTML += "<option value='"+p.username+"'>Dr. "+p.last+"</option>");
    });
}

function getProviderCalendar(callback){

    var p_events = [];
    var p_email = document.getElementById("doctors").value;
    getUser(p_email, function(user){
        getSchedule(user.scheduleid, function(sched) {
            sched.appointments.forEach(a => {
                if (a.with === "") {
                    p_events.push({
                        title: 'Available',
                        start: new Date(a.date),
                        color: '#6d9ab3',
                        appointment_id: a._id
                    });
                }
            });
            callback(p_events);
        });
    });
}

function getUserCalendar(callback){
    var u_events = [];
    getUser(currentUser, function(user){
        getSchedule(user.scheduleid, function(sched) {
            sched.appointments.forEach(a => {
                u_events.push({
                        title: a.with,
                        start: new Date(a.date),
                        color: '#4f7850',
                        appointment_id: a._id,
                        eventRender: function (color, element) {
                            if (color) {
                                element.css('background-color', color)
                            }
                        }
                 });
            });
            callback(u_events);
        });
    });
}