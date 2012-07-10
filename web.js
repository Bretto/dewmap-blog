var express = require('express');

var app = express.createServer(express.logger());

var mongo = require('mongodb');
var https = require('https');
var ObjectID = require('mongodb').ObjectID;
var db;
var port = process.env.PORT || 5000;





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




var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');//'X-Requested-With');
    next();
}


app.configure(function () {
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.logger('dev'));  //tiny, short, default
    app.use(allowCrossDomain);
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({dumpExceptions: true, showStack: true, showMessage: true}));
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

app.get('/', function(req, res) {
    //response.send('Hello Rerun Express Local :)');
    res.sendfile('/index.html');
    //or redirect ?
});

//Query
app.get('/api/:collection', function(req, res) {
    db.collection(req.params.collection).find({}).toArray(fn(req, res));
});

//Get by Id
app.get('/api/:collection/:id', function(req, res) {
    db.collection(req.params.collection).findOne({_id: ObjectID(req.params.id)}, fn(req, res));
});

//Create
app.post('/api/:collection', function(req, res) {
    db.collection(req.params.collection).save(req.body, {safe:true}, fn(req, res));
});

//Update
app.put('/api/:collection/:id', function(req, res) {
    db.collection(req.params.collection).update({_id: ObjectID(req.params.id)}, req.body, {safe:true}, fn(req, res));
});

//Delete
app.del('/api/:collection/:id', function(req, res) {
    db.collection(req.params.collection).remove({_id: ObjectID(req.params.id)}, {safe:true}, fn(req, res));
});








app.listen(port, function() {
    console.log("Listening on " + port);
});