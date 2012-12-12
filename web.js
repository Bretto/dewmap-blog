var express = require('express')
    , bcrypt = require('bcrypt')
    , routes = require('./routes')
    , api = require('./routes/api')
    , SALT_WORK_FACTOR = 10;


var app = express.createServer(express.logger());


var port = process.env.PORT || 5000;


var allowCrossDomain = function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
    next();
}


app.configure(function () {

    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set('view options', { layout:false });

    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.logger('dev'));  //tiny, short, default
    app.use(express.cookieParser('shhhh, this is very secret'));
    app.use(express.session({ secret:"string" }));

//    app.use(function (req, res, next) {
//        console.log('Middleware' + res);
//        var err = req.session.error
//            , msg = req.session.success;
//        delete req.session.error;
//        delete req.session.success;
//        res.locals.message = '';
//        if (err) res.locals.message = '<div class="alert alert-error"><p>' + err + '</p></div>';
//        if (msg) res.locals.message = '<div class="alert alert-success"><p>' + msg + '</p></div>';
//
//        next();
//    });

    //app.use(allowCrossDomain);
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);


});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true, showMessage:true}));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});



function authenticate(usr, psw, fn) {

    api.db.collection('users').find({usr:usr}).toArray(function (err, res) {
        if (err) return next(err);

        if(res.length  > 0){
            var user = res[0];
            bcrypt.compare(psw, user.psw, function(err, res) {
                if (err) throw err;
                if(res){
                    return fn(null, user);
                }else{
                    fn(new Error('invalid user/password'));
                }

            });
        }else{
            fn(new Error('invalid user/password'));
        }
    });
}






app.post('/login', function (req, res) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate(function () {
                req.session.user = user;
                req.session.success = 'Authenticated as ' + req.session.user.usr;
                res.locals.message = '<div class="alert alert-success">' + req.session.success + '<button type="button" class="close" data-dismiss="alert">×</button></div>';
                res.send({message:res.locals.message});
            });
        } else {
            req.session.error = 'Authentication failed, please check your username and password.'
            res.locals.message = '<div class="alert alert-error">' + req.session.error + '<button type="button" class="close" data-dismiss="alert">×</button></div>';
            res.send(401, {message:res.locals.message});
        }
    });
});

app.get('/logout', function (req, res) {
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function () {
        res.redirect('/');
    });
});

// to register admin users
//app.post('/users', function (req, res) {
//
//    var usr = req.body.username;
//    var psw = req.body.password;
//    var hashPsw;
//
//    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
//        if (err) return next(err);
//
//        // hash the password using our new salt
//        bcrypt.hash(psw, salt, function (err, hash) {
//            if (err) return next(err);
//
//            // override the cleartext password with the hashed one
//            psw = hash;
//
//            api.db.collection('users').save({usr:usr, psw:psw}, {safe:true}, function (err, saved) {
//                if (err || !saved) console.log("User not saved");
//                else console.log("User saved");
//            });
//            next();
//        });
//    });
//
//
//});


function restrict(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.send(401);
    }
}


//app.get('/', routes.index);
//app.get('/post', routes.index);
app.get('/partials/:name', routes.partials);
//app.get('/post/:id', routes.index);

// JSON API

app.get('/api/isLoggedId', api.isLoggedIn);

//Query
app.get('/api/:collection', api.posts);

//Get by Id
app.get('/api/:collection/:id', api.post);

//Create
app.post('/api/:collection', restrict, api.createPost);

//Update
app.put('/api/:collection/:id', restrict, api.updatePost);

//Delete
app.del('/api/:collection/:id', restrict, api.deletePost);

app.get('*', routes.index);

app.listen(port, function () {
    console.log("Listening on " + port);
});