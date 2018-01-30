// Note routes

const ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
    // Handle POST requests
    app.post('/notes', (req, res) => {
        // Create the note
        const note = {
            title: req.body.title,
            text: req.body.text
        }
        // Add note to a collection in the database
        db.collection('notes').insert(note, (err, result) => {
            if (err) {
                console.log('Oops! An error has occurred.');
            } else {
                // Respond with the note
                res.send(result.ops[0]);
            }
        })
    });

    // Handle GET requests
    app.get('/notes/:id', (req, res) => {
        const capturedId = req.params.id
        // MongoDB stores IDs as ObjectIDs, so convert the id string
        const queryObject = {
            _id: new ObjectID(capturedId)
        }
        db.collection('notes').findOne(queryObject, (err, result) => {
            if (err) {
                console.log('Oops! An error has occurred.');
            } else {
                // Respond with the requsted note, if it exists
                if (result) {
                    res.send(result);
                } else {
                    res.send('Note not found.');
                }
            }
        });
    });

    // Handle DELETE requests
    app.delete('/notes/:id', (req, res) => {
        const capturedId = req.params.id;
        // MongoDB stores IDs as ObjectIDs, so convert the id string
        const queryObject = {
            _id: new ObjectID(capturedId)
        }
        db.collection('notes').deleteOne(queryObject, (err, result) => {
            if (err) {
                console.log('Oops! An error has occurred.');
            } else {
                // Confirm if the item was deleted
                if (result.result.n === 1) {
                    res.send('Successfully deleted note with id ' + capturedId + '.');
                } else {
                    res.send('Could not find note with id ' + capturedId + ', so did not delete anything');
                }
            }
        })
    });

    // Handle PUT requests
    app.put('/notes/:id', (req, res) => {
        const capturedId = req.params.id;
        // MongoDB stores IDs as ObjectIDs, so convert the id string
        const queryObject = {
            _id: new ObjectID(capturedId)
        }
        // Create an empty note
        const note = {}
        // Only update 'title' or 'text' properties that exist in the request
        // Prevents missing request parameter from deleting property in the database
        // Prevent addition of properties other than 'title' or 'text'
        const possibleProperties = ['title', 'text'];
        possibleProperties.forEach(property => {
            if (req.body[property]) {
                // Add property to new note
                note[property] = req.body[property];
            }
        })
        
        // Update the requested note in the database
        db.collection('notes').update(queryObject, note, (err, result) => {
            if (err) {
                console.log('Oops! An error has occurred.');
            } else {
                res.send(result);
            }
        });
    });

} // End of module.exports