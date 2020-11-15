module.exports = app => {
    const users = require("../controllers/users.controller.js");
    const schedules = require("../controllers/schedules.controller.js");

    var router = require("express").Router();

    // Create a new user
    router.post("/users", users.create);
    router.post("/schedules", schedules.create);

    router.get("/users", users.findAll);

    router.get("/schedules", schedules.findAll);

    router.get("/users/providers", users.findAllProviders);

    router.get("/users/:username", users.findOne);

    router.put("/schedules/:id", schedules.update);

    // router.delete("/:id", tutorials.delete);
    //
    // router.delete("/", tutorials.deleteAll);

    app.use('/api', router);
};