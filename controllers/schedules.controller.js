const db = require("../models");
const axios = require('axios');
const Schedule = db.schedules;

// Create and Save a new Schedule
exports.create = (req, res) => {

    // Create a Schedule
    const schedule = new Schedule({
        appointments: [],
    });

    // Save user in the database
    schedule
        .save(schedule)
        .then(data => {
            res.send(data).status(200);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the schedule."
            });
        });
};

// Retrieve all Schedules from the database.
exports.findAll = (req, res) => {
        Schedule.find()
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving schedules."
                });
            });
};

// Find a single schedule with an id
exports.findOne = (req, res) => {

        const id = req.params.id;
        Schedule.findById(id)
            .then(data => {
                if (!data)
                    res.status(404).send({ message: "No Schedule found with id " + id });
                else res.send(data).status(200);
            })
            .catch(err => {
                res
                    .status(500)
                    .send({ message: "Error retrieving schedule with id=" + id });
            });
};

exports.findAppointmentById = (req, res) => {

    const id = req.params.id;
    const apptid = req.params.apptid;
    Schedule.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No Schedule found with id " + id });
            else {
                console.log(data.appointments);
                data.appointments.findById(apptid)
                    .then(appt => {
                        if (!appt)
                            res.status(404).send({ message: "No Appointment found with id " + apptid });
                        else res.send(appt).status(200);
                    })
                    .catch(err => {
                        res
                            .status(500)
                            .send({ message: "Error retrieving appointment with id=" + apptid });
                    });
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving schedule with id=" + id });
        });
};

exports.createZoomMeeting = (req, res) => {
    const id = req.params.id;
    const apptid = req.body.param.apptid;

    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    Schedule.findById(id)
        .then(sched => {
            if (!sched)
                res.status(404).send({ message: "No Schedule found with id " + id });
            else {
                var idx = sched.appointments.findIndex(a => apptid.normalize() === a._id.toString());
                if (idx === -1){
                    idx = sched.appointments.length;
                }

                axios({
                    method: 'post',
                    url: "https://api.zoom.us/v2/users/kulakowskin0408%40gmail.com/meetings",
                    headers: {
                        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6IlM4TzVkM1VMVDFTVVU3S0Y0a01UM3ciLCJleHAiOjE2MDk0NDE1NjAsImlhdCI6MTYwNTk4MDIwOX0.ClT_V7-7_wXRT61nNb69G1SNoy-Fyyk0e794bYB3C3c"
                    },
                    data: {
                        "topic": req.body.sched.appointments[idx].with,
                        "type": "2",
                        "start_time": req.body.sched.appointments[idx].date,
                        "duration": "30",
                        "timezone": "America/New_York",
                        "agenda": "",
                        "settings": {
                            "join_before_host": true,
                            "approval_type": 0,
                            "waiting_room": false
                        }
                    }
                })
                    .then(function (mtgBody) {

                        req.body.sched.appointments[idx].zoom.apiKey = "S8O5d3ULT1SUU7KF4kMT3w";
                        req.body.sched.appointments[idx].zoom.apiSecret = "uuRn3o2sDIpPBxFh1tAHRaq3frUrDhfC4zoe";
                        req.body.sched.appointments[idx].zoom.meetingNumber = mtgBody.data.id;
                        req.body.sched.appointments[idx].zoom.password = mtgBody.data.password;

                        Schedule.findByIdAndUpdate(id, req.body.sched, {useFindAndModify: true, new: true})
                            .then(data => {
                                if (!data) {
                                    res.status(404).send({
                                        message: `Cannot update Schedule with id=${id}. Maybe schedule was not found!`
                                    });
                                } else res.send(data);
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message: "Error updating Schedule with id=" + id
                                });
                            });

                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res
                .status(500)
                .send({ message: "Error retrieving schedule with id=" + id});
        });
};

// Update a schedule by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Schedule.findByIdAndUpdate(id, req.body, { useFindAndModify: true })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Schedule with id=${id}. Maybe schedule was not found!`
                });
            } else res.send({ message: "Schedule was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Schedule with id=" + id
            });
        });
};

// // Delete a Tutorial with the specified id in the request
// exports.delete = (req, res) => {
//
// };
//
// // Delete all Tutorials from the database.
// exports.deleteAll = (req, res) => {
//
// };

