

var mongo = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var db = null;

// Connect to a mongo database via URI
// With the MongoLab addon the MONGOLAB_URI config variable is added to your
// Heroku environment.  It can be accessed as process.env.MONGOLAB_URI
mongo.connect(process.env.MONGOLAB_URI, {}, function(error, $db){
    // console.log will write to the heroku log which can be accessed via the
    // command line as "heroku logs"
    db = $db;
    db.addListener("error", function(error){
        console.log("Error connecting to MongoLab");
    });

});



//Function callback
var fn = function (req, res) {
    res.contentType('application/json');
    var fn = function (err, doc) {
        if (err) {
            if (err.message) {
                doc = {error : err.message}
            } else {
                doc = {error : JSON.stringify(err)}
            }
        }
        if (typeof doc === "number" || req.params.cmd === "distinct") { doc = {ok : doc}; }
        res.send(doc);
    };
    return fn;
};


exports.isLoggedIn = function(req, res) {
    console.log("isLoggedIn");

    if (req.session && req.session.user) {
        res.send('admin');
    }
    else
    {
        res.send('user');
    }
};

//Get
exports.posts = function(req, res) {
    db.collection(req.params.collection).find({}).toArray(fn(req, res));
};

//Get by Id
exports.post = function(req, res) {
    db.collection(req.params.collection).findOne({_id: ObjectID(req.params.id)}, fn(req, res));
};

//Create
exports.createPost = function(req, res) {
    db.collection(req.params.collection).save(req.body, {safe:true}, fn(req, res));
};

//Update
exports.updatePost = function(req, res) {
    db.collection(req.params.collection).findAndModify({_id: ObjectID(req.params.id)}, [], req.body, {new:true, upsert:true, safe:true}, fn(req, res));
};

//Delete
exports.deletePost =  function(req, res) {
    db.collection(req.params.collection).remove({_id: ObjectID(req.params.id)}, {safe:true}, fn(req, res));
};




