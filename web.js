var fs = require('fs');
var express = require('express');

var app = express.createServer(express.logger());

// var fileContent = .toString('utf-8');


app.get('/', function(request, response) {
   response.set('Content-Type', 'text/html');
   response.end(fs.readFileSync('index.html'));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
