var express = require('express')
            , hash = require('./pass').hash
            , routes = require('./routes')
            , api = require('./routes/api');

var app = express.createServer(express.logger());


var port = process.env.PORT || 5000;







var allowCrossDomain = function(req, res, next) {

//    var contentTypesByExtension = {
//        'html': "text/html",
//        'js':   "text/javascript"
//    };
//
//    var contentType = contentTypesByExtension[fileExtension] || 'text/plain';

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
    next();
}


app.configure(function () {

    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set('view options', { layout: false });

    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.logger('dev'));  //tiny, short, default
    app.use(express.cookieParser('shhhh, very secret'));
    app.use(express.session({ secret: "string" }));

    app.use(function(req, res, next){
        console.log('Middleware'+ res);
        var err = req.session.error
            , msg = req.session.success;
        delete req.session.error;
        delete req.session.success;
        res.locals.message = '';
        if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
        if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';

        next();
    });

    //app.use(allowCrossDomain);
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true, showMessage: true}));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

//-------- LOGIN --------
// Session-persisted message middleware



// dummy database

var users = {
    brett: { name: 'brett' }
};

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)

hash('login', function(err, salt, hash){
    if (err) throw err;
    // store the salt & hash in the "db"
    users.brett.salt = salt;
    users.brett.hash = hash;
});


// Authenticate using our plain-object database of doom!
function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);
    var user = users[name];
    // query the db for the given username
    if (!user) return fn(new Error('cannot find user'));
    // apply the same algorithm to the POSTed password, applying
    // the hash against the pass / salt, if there is a match we
    // found the user
    hash(pass, user.salt, function(err, hash){
        if (err) return fn(err);
        if (hash == user.hash) return fn(null, user);
        fn(new Error('invalid password'));
    })
}

function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

app.get('/restricted', restrict, function(req, res){
    res.send('Wahoo! restricted area');
});

app.get('/logout', function(req, res){
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function(){
        res.redirect('/');
    });
});

app.get('/login', function(req, res){
    if (req.session.user) {
        req.session.success = 'Authenticated as ' + req.session.user.name;
        res.locals.message = req.session.success;
    }
    res.send({message:res.locals.message});
});

app.post('/login', function(req, res){
    authenticate(req.body.username, req.body.password, function(err, user){
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate(function(){
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user;
                res.redirect('/login');
            });
        } else {
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.'
                + ' (use "brett" and "login")';
                res.redirect('/login');
        }
    });
});
//-----------------------


app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API

//Query
app.get('/api/:collection', api.posts);

//Get by Id
app.get('/api/:collection/:id', api.post);

//Create
app.post('/api/:collection', api.createPost);

//Update
app.put('/api/:collection/:id', api.updatePost);

//Delete
app.del('/api/:collection/:id', api.deletePost);




app.listen(port, function() {
    console.log("Listening on " + port);
});