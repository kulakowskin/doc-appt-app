const db = require("../models");
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

// Retrieve all Scheduless from the database.
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

// Find a single User with an id
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

// Update a schedule by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Schedule.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

