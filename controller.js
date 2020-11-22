var API_KEY = "S8O5d3ULT1SUU7KF4kMT3w";

/**
 * NEVER PUT YOUR ACTUAL API SECRET IN CLIENT SIDE CODE, THIS IS JUST FOR QUICK PROTOTYPING
 * The below generateSignature should be done server side as not to expose your api secret in public
 * You can find an eaxmple in here: https://marketplace.zoom.us/docs/sdk/native-sdks/web/essential/signature
 */
var API_SECRET = "uuRn3o2sDIpPBxFh1tAHRaq3frUrDhfC4zoe";

var currentUser = "";
var events = [];


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
                    loadCalendar(u_events);
                });

                populateProviderDropdown();
            }
            else if(tab_name === "ViewAppointments.html"){
                populateAppointmentTable();
            }
        });

    });

}

//loggedin or loggedout
function setCookie(user) {
    document.cookie = "user="+user+";";
}

function getCookie(name){
    name = name+"=";
    var ret = null;
    var cookies = document.cookie.split("; ");
    cookies.forEach(c => {
        if (c.includes(name)){
            console.log(c.substring(name.length,c.length));
            ret = c.substring(name.length,c.length);
        }
    });
    return ret;
}

if(isLoggedIn() === null){
    console.log("user not logged in");
    jQuery(document).ready(function(){
        jQuery("#tab").load("signin.html");
    });
}
else {
    jQuery(document).ready(function(){
        makeActive("schedule.html",document.getElementById("scheduletab"));
        let elems = document.getElementsByClassName("loggedin");
        for(var i=0;i<elems.length; i++)
        {
            elems[i].style.display = "block";
        }
    });
}

function isLoggedIn() {
    currentUser = getCookie("user");
    return currentUser;
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
        //combineCalendars();
        makeActive('ViewAppointments.html',document.getElementById("appointmenttab"))
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

function populateAppointmentTable(){
    var tableElem = document.getElementById("appttable");
    getUser(currentUser, function(user){
        getSchedule(user.scheduleid, function(sched){
            sched.appointments.forEach(function iterate(a, i) {
                tableElem.innerHTML += "<tr><td>"+new Date(a.date)+"</td><td>"+a.with+"</td><td><button id=\"mtg-btn-"+i+"\" class=\"join_meeting\">Join Meeting</button></td></tr>"
                loadMeetingButton(a,i);
            });
        })
    })
}

function loadMeetingButton(appt, btnidx) {
    // click join meeting button
    let meetbtn = document.getElementById("mtg-btn-"+btnidx);
    meetbtn.addEventListener("click", function (e) {
        e.preventDefault();
        var signature = ZoomMtg.generateSignature({
            meetingNumber: appt.zoom.meetingNumber,
            apiKey: appt.zoom.apiKey,
            apiSecret: appt.zoom.apiSecret,
            role: 0,
            success: function (res) {
                ZoomMtg.init({
                    leaveUrl: "https://dr-appointment-app.herokuapp.com",
                    isSupportAV: true,
                    success: function () {
                        ZoomMtg.join({
                            signature: res.result,
                            apiKey: appt.zoom.apiKey,
                            meetingNumber: appt.zoom.meetingNumber,
                            userName: currentUser,
                            passWord: appt.zoom.password,
                            error(result) {
                                console.log(result)
                            }
                        })
                    }
                })
            },
        });
        document.getElementById("zmmtg-root").style.display = "block";
    });
}


jQuery(document).ready(function()
{
    console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));
    ZoomMtg.setZoomJSLib('https://source.zoom.us/1.8.3/lib', '/av');
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
});