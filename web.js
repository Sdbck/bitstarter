var fs = require('fs');
var express = require('express');

var app = express.createServer(express.logger());

var fileContent = fs.readFileSync('index.html').toString('utf-8');


app.get('/', function(request, response) {
  response.send(fileContent);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
