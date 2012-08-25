var mongo = require('mongodb');


exports.ObjectID = require('mongodb').ObjectID;




// Connect to a mongo database via URI
// With the MongoLab addon the MONGOLAB_URI config variable is added to your
// Heroku environment.  It can be accessed as process.env.MONGOLAB_URI
mongo.connect(process.env.MONGOLAB_URI, {}, function(error, $db){
    // console.log will write to the heroku log which can be accessed via the
    // command line as "heroku logs"
    exports.db = $db;
    exports.db.addListener("error", function(error){
        console.log("Error connecting to MongoLab");
    });

});