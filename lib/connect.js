var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var oracle = require("oracle");

function connectRoute() {
  var connect = new express.Router();
  connect.use(cors());
  connect.use(bodyParser());


  // GET REST endpoint - query params may or may not be populated
  connect.get('/', function(req, res) {
    console.log(new Date(), 'In hello route GET / req.query=', req.query);

    var connectData = {
        hostname: req.query.host,
        port: req.query.port,
        database: req.query.database, 
        user: req.query.user,
        password: req.query.password
    };

    console.log(new Date(), connectData);

    console.log(new Date(), 'About to connect');
    oracle.connect(connectData, function(err, connection) {
        if (err) { console.log("Error connecting to db:", err); return (err);}
     
        console.log(new Date(), 'No error, about to execute');
        connection.execute("SELECT systimestamp FROM dual", [], function(err, results) {
            if (err) { console.log(new Date(), "Error executing query:", err); return; }
     
            console.log(new Date(), 'No error, results.....');
            console.log(results);
            connection.close(); // call only when query is finished executing 
            res.json({msg: 'Successful Connection'});
        });
    });

  });

  // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // This can also be added in application.js
  // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  connect.post('/', function(req, res) {
    console.log(new Date(), 'In hello route POST / req.query=', req);
    console.log(new Date(), 'here i am');

    var connectData = {
        hostname: req.host,
        port: req.port,
        database: req.database, 
        user: req.user,
        password: req.password
    };

/*
    var connectData = {
        hostname: "ora.cpszqo8yga1b.us-west-2.rds.amazonaws.com",
        port: 1521,
        database: "ORCL", 
        user: "admin",
        password: "console123:"
    };
*/

    console.log(new Date(), connectData);

    console.log(new Date(), 'About to connect');
    oracle.connect(connectData, function(err, connection) {
        if (err) { console.log("Error connecting to db:", err); return; }
     
        console.log(new Date(), 'No error, about to execute');
        connection.execute("SELECT systimestamp FROM dual", [], function(err, results) {
            if (err) { console.log(new Date(), "Error executing query:", err); return; }
     
            console.log(new Date(), 'No error, results.....');
            console.log(results);
            connection.close(); // call only when query is finished executing 
        });
    });

    res.json({msg: 'Successful Connection'});
  });

  return connect;
}

module.exports = connectRoute;
