// Note routes

module.exports = function(app, db) {
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
}