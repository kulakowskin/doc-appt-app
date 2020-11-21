// import { createRequire } from 'module'
// const require = createRequire(import.meta.url);

var express = require('express');
const MongoClient = require('mongodb').MongoClient;
// Replace the uri string with your MongoDB deployment's connection string.
const uri =
    "mongodb+srv://nicole:834NXwYWoB79GyGJ@appt-db.kfvao.mongodb.net/?retryWrites=true&w=majority";
var app = express();

// set port
var port = process.env.PORT || 8080;

// const path = require('path');
// var __dirname = path.resolve();
app.use(express.static(__dirname));

console.log("dirname: ", __dirname);

// routes
app.get("/", function(req,res){
    res.render("index.js");
});


var cors = require('cors');
app.use(require('body-parser').json()); // When someone sends something to the server, we can recieve it in JSON format
//enables cors
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}));

//const client = new MongoClient(uri, { useNewUrlParser: true });

const db = require("./models");
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

// connect to your MongoDB database through your URI.
// The connect() function takes a uri and callback function as arguments.
// client.connect( err => {
//     // connect to your specific collection (a.k.a database) that you specified at the end of your URI (/database)
//     const collection = client.db("appt-maker").collection("users");
//
//     // Responds to GET requests with the route parameter being the username.
//     // Returns with the JSON data about the user (if there is a user with that username)
//     // Example request: https://mynodeserver.com/myusername
//     app.get("/:username", (req, res) => {
//         // search the database (collection) for all users with the `user` field being the `user` route paramter
//         collection.find({ username: req.params.username }).toArray((err, docs) => {
//             if (err) {
//                 // if an error happens
//                 res.send("Error in GET req.");
//             } else {
//                 // if all works
//                 res.send(docs); // send back all users found with the matching username
//             }
//         });
//     });

    // Responds to POST requests with the route parameter being the username.
    // Creates a new user in the collection with the `user` parameter and the JSON sent with the req in the `body` property
    // Example request: https://mynodeserver.com/myNEWusername
    // app.post("/:username", (req, res) => {
    //     // inserts a new document in the database (collection)
    //     collection.insertOne( req.body, (err, r) => {
    //             if (err) {
    //                 res.send("Error in POST req.");
    //             } else {
    //                 res.send(r.result);
    //             }
    //         }
    //     );
    // });

    // this doesn't create a new user but rather updates an existing one by the user name
    // a request looks like this: `https://nodeserver.com/username23` plus the associated JSON data sent in
    // the `body` property of the PUT request
    // app.put("/:username", (req, res) => {
    //     collection.find({ username: req.params.username }).toArray((err, docs) => {
    //         if (err) {
    //             // if and error occurs in finding a user to update
    //             res.send("Error in PUT req.");
    //         } else {
    //             collection.updateOne(
    //                 { username: req.params.username }, // if the username is the same, update the user
    //                 {
    //                     $set: {
    //                         user: ,
    //                     },
    //                 },
    //                 (req.body, // update user data
    //                 (err, r) => {
    //                     if (err) {
    //                         // if error occurs in actually updating the data in the database
    //                         console.log("Error in updating database information");
    //                     } else {
    //                         // everything works! (hopefully)
    //                         res.send(r.result);
    //                     }
    //                 }
    //             ));
    //         }
    //     });

        // if someone goes to base route, send back they are home.
    //     app.get("/", (req, res) => {
    //         res.send("You are home 🏚.");
    //     });
    // });

require("./routes/routes")(app);

// listen for requests
var listener = app.listen(port, () => {
    console.log("Your app is listening on port " + listener.address().port);
});