const db = require("../models");
const User = db.users;
const Schedule = db.schedules;

// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Validate request
    if (!req.body.username) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    console.log("in create function");
    const schedule = new Schedule();

    // Create a User
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        first: req.body.first,
        last: req.body.last,
        scheduleid: schedule.id,
        provider: req.body.provider
    });
    // Save user in the database
    user
        .save(user)
        .then(data => {
            console.log("saved user");
            res.send(data).status(200);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the user."
            });
        });

    // Save schedule in the database
    schedule
        .save(schedule)
        .then(data => {
            console.log("saved user's schedule");
            res.send(data).status(200);
        })
        .catch(err => {
            res.status(500);
        });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
        User.find()
            .then(data => {
                res.send(data).status(200);
                console.log(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving users."
                });
            });
};

// Find a single User with an id
exports.findOne = (req, res) => {
    var user = req.params.username;
        User.findOne({'username' : req.params.username})
            .then(data => {
                if (!data)
                    res.status(404).send({ message: "Not found User with id " + user });
                else res.send(data).status(200);
            })
            .catch(err => {
                res
                    .status(500)
                    .send({ message: "Error retrieving User with id=" + user});
            });
};

// Find all provider users
exports.findAllProviders = (req, res) => {
    User.find({ provider: true })
        .then(data => {
            res.send(data).status(200);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

//
// // Update a Tutorial by the id in the request
// exports.update = (req, res) => {
//
// };
//
// // Delete a Tutorial with the specified id in the request
// exports.delete = (req, res) => {
//
// };
//
// // Delete all Tutorials from the database.
// exports.deleteAll = (req, res) => {
//
// };
//

