const express = require('express');
const parser = require('body-parser');
const app = express();

app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

MongoClient.connect('mongodb://localhost:27017', function(err, client) {
  if (err) {
    console.log(err);
    return;
  }

  const db = client.db("mongo_practice");
  console.log('Connected to database');

  app.post('/api/stuff', function(req, res, next) {
    const collectionOfStuff = db.collection('stuff');
    const newThing = req.body;
    collectionOfStuff.save(newThing, function(err, result) {
      if(err) next(err);
      res.status(201);
      res.json(result.ops[0]);
      console.log('Saved to database!');
    })
  });

  app.get('/api/stuff', function(req, res, next) {
    const collectionOfStuff = db.collection('stuff');
    collectionOfStuff.find().toArray(function(err, allThings) {
      if (err) next(err);
      res.json(allThings);
    })
  });

  app.listen(3000, function(){
    console.log("Listening on port 3000");
  });

})
