// REQUIRE
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var mongo = require('mongodb');

// MONGO
var MongoClient = mongo.MongoClient;
var ObjectID = mongo.ObjectID;

// EXPRESS APP
var app = express();

// STATIC
app.use(express.static('./public'));

// BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

MongoClient.connect('mongodb://localhost:27017/todo-app', function(err, db){

//(C)reate To-Do Items and placing them into the datatbase
app.post('/todo', function(req, res){
    req.body.finished = false;
    db.collection('todo-items').insert(req.body, function (err, doc){
        if (err) {console.log(err);}
        db.collection('todo-items').find({}).toArray(function(err, docs){
            if (err) {console.log(err);}
            res.send(docs);
        });
    });
});

// (R)etrieving To-Do Items from Database to send to front-end
app.get('/todo', function(req, res){
    db.collection('todo-items').find({}).toArray(function(err, docs){
        if (err) {console.log(err);}
        res.send(docs);
    });
});

// (M)odifying front end data
app.post('/finished', function(req, res){
    db.collection('todo-items').update(
        { _id : ObjectID(req.body.todoID) },
        { $set: {finished : true} },
        function(err, doc){
        if (err) {console.log(err);}
        db.collection('todo-items').find({}).toArray(function(err, docs){
            if (err) {console.log(err);}
            res.send(docs);
        });
    });
});

// (M)odifying front end data
app.post('/incom', function(req, res){
    db.collection('todo-items').update(
        { _id : ObjectID(req.body.todoID) },
        { $set: {finished : false} },
        function(err, doc){
        if (err) {console.log(err);}
        db.collection('todo-items').find({}).toArray(function(err, docs){
            if (err) {console.log(err);}
            res.send(docs);
        });
    });
});


// (D)elete
app.post('/todo/delete/:_id', function(req, res){
    var itemID = ObjectID(req.params._id);
    db.collection('todo-items').remove({
         _id : itemID
     },
        function(err, doc){
            if (err) {next(err);}
            else {
                db.collection('todo-items').find({}).toArray(function(err, docs){
                    if (err) {console.log(err);}
                    res.send(docs);
                });
            }
     });
});



app.use(function(req, res, next) {
    res.status(404).send('not found');
});
app.use(function(req, res, next) {
    res.status(500).send('oops');
});
app.listen(8000);
}); // end database connect
