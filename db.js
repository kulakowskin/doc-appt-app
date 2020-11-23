
const api_url = "https://dr-appointment-app.herokuapp.com/api/";
//const api_url = "http://localhost:8080/api/";


function getUser(username, callback) {
    axios.get(api_url+"users/"+encodeURIComponent(username))
        .then(res => {
            const user = res.data;
            //console.log(res.data);
            callback(user);
        });
}

function getSchedule(id, callback) {
    axios.get(api_url+"schedules/"+id)
        .then(res => {
            const schedule = res.data;
            //console.log(res.data);
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

function updatePatientProviderSchedule(patient, event, provider, callback) {
    getUser(patient, function(user) {
        getSchedule(user.scheduleid, function(sched) {
            var id = event.extendedProps.appointment_id;
            var param = { apptid : id};
            // insert patient appointment
            sched.appointments.push({
                _id: id,
                date: event.start,
                with: provider,
                zoom: {
                    meetingNumber: "",
                    apiKey: "",
                    apiSecret: "",
                    password: ""
                }
            });

            axios.put(api_url +"schedules/zoom/"+sched._id, {sched: sched, param})
                .then(res => {
                    console.log("Updated patient schedule: ",res.data);
                    getUser(provider, function(p){
                        getSchedule(p.scheduleid, function(psched){
                            // update provider appointment
                            var idx = psched.appointments.findIndex(a => a._id.normalize() === id.normalize());
                            var patient_i = res.data.appointments.findIndex(a => a._id.normalize() === id.normalize());
                            var patient_sched = res.data.appointments[patient_i];
                            console.log("appt id: ",id);
                            console.log("patient_idx: ",patient_i);
                            psched.appointments[idx] = {
                                _id: id,
                                date: event.start,
                                with: patient,
                                zoom: {
                                    meetingNumber: patient_sched.zoom.meetingNumber,
                                    apiKey: patient_sched.zoom.apiKey,
                                    apiSecret: patient_sched.zoom.apiSecret,
                                    password: patient_sched.zoom.password
                                }
                            };

                            axios.put(api_url +"schedules/"+psched._id, psched)
                                .then(res => {
                                    console.log("Updated provider schedule: ",res.data);
                                    callback();
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        })
                    });

                })
                .catch(err => {
                    console.log(err);
                });

        });
    })
}


