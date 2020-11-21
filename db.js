
const api_url = "https://dr-appointment-app.herokuapp.com/api/";
//const api_url = "http://localhost:8080/api/";


function getUser(username, callback) {
    axios.get(api_url+"users/"+encodeURIComponent(username))
        .then(res => {
            const user = res.data;
            console.log(res.data);
            callback(user);
        });
}

function getSchedule(id, callback) {
    axios.get(api_url+"schedules/"+id)
        .then(res => {
            const schedule = res.data;
            console.log(res.data);
            callback(schedule);
        });
}

function getAllProviders(callback){
    axios.get(api_url+"users/providers")
        .then(res => {
            const providers = res.data;
            console.log(providers);
            callback(providers);
        });
}

function createUser() {
    var username = document.getElementById("email").value;
    const user = {
        username: username,
        first: document.getElementById("first").value,
        last: document.getElementById("last").value,
        password: document.getElementById("password").value,
        provider: document.getElementById("provider").checked
    };
    axios.post(api_url+"users/", user)
        .then( res => {
            console.log(res.data);
            login();
            });
}

function updateUserSchedule(email, event, meetingWith) {
    getUser(email, function(user) {
        getSchedule(user.scheduleid, function(sched) {

            var id = event.extendedProps.appointment_id;

            // update provider appointment
            if (user.provider) {
                var idx = sched.appointments.findIndex(a => a._id.normalize() === id.normalize());

                console.log(idx);
                sched.appointments[idx] = {
                    _id: id,
                    date: event.start,
                    with: meetingWith,
                    zoom: {
                        meetingNumber: "",
                        apiKey: "",
                        apiSecret: "",
                        password: ""
                    }
                };
            }
            // insert patient appointment
            else{
                sched.appointments.push({
                    _id: id,
                    date: event.start,
                    with: meetingWith,
                    zoom: {
                        meetingNumber: "",
                        apiKey: "",
                        apiSecret: "",
                        password: ""
                    }
                });
            }
            // axios.put(api_url +"schedules/"+sched._id,sched)
            //     .then(res => {
            //         console.log(res.data);
            //     })

            var param = { apptid : id};
            axios.put(api_url +"schedules/"+sched._id, {sched: sched, param})
                .then(res => {
                    console.log(res.data);
                })
                .catch(err => {
                    console.log(err);
                })

        });
    })
}


