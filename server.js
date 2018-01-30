// Import dependencies
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

// Initialize app as an instance of Express
const app = express();

// Apply middleware to parse URL encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set the port we will be listening on
const port = 8000;

// Import database details 
const db = require('./config/db');

// Connect to database
MongoClient.connect(db.url, (err, client) => {
    // Handle errors
    if (err) {
        return console.log(err);
    }

    // If there are no errors, handle the routes
    const routesHandler = require('./app/routes');
    routesHandler(app, client.db(db.name));
    
    // Listen for requests
    app.listen(port, () => {
        console.log('We are live on ' + port);
    });
});