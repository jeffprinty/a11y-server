//server.js
'use strict'
//first we import our dependencies…
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const shortid = require('shortid');
require('dotenv').config()

//and create our instances
const app = express();
const router = express.Router();
//set our port to either a predetermined port number if you have set 
//it up, or 3001
const port = process.env.API_PORT || 3001;

mongoose.connect(process.env.MONGODB_URI);

//now we should configure the API to use bodyParser and look for 
//JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const Schema = mongoose.Schema;
const AssessmentSchema = new Schema({
 text: String,
 url: String,
 title: String,
 shortId: String,
 checkValues: Array,
 notes: Array
});

const Assessment = mongoose.model('Assessment', AssessmentSchema)

function addAssessment(req,res) {
  console.log("req", req.body);
  const assessment = new Assessment({...req.body})
  assessment.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json(assessment);
    }
  })
}
//To prevent errors from Cross Origin Resource Sharing, we will set 
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', ' * ');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});
//now we can set the route path & initialize the API
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!' });
});

router.post('/new', (req, res) => {
  const shortId = shortid.generate();
  const assessment = new Assessment({shortId, ...req.body})
  assessment.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json(assessment);
    }
  })
});
router.post('/update/:id', (req, res) => {
  console.log("req.params.shortId", req.params.id, req.body.text);
  Assessment.findOneAndUpdate({shortId: req.params.id}, {...req.body}, function(err,doc) {
    if (err) {
      res.send(err);
    } else {
      console.log("doc", doc);
      res.send('successfully updated');
    }
  })
});

//Use our router configuration when we call /api
app.use('/api', router);
//starts the server and listens for requests
app.listen(port, function() {
    console.log(`api running on port ${port}`);
});
