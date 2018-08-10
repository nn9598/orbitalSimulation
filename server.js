const dotenv = require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var path = require('path');
var fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname));

const server = app.listen(8000, () => {
  console.log('Server listening on port %d in %s mode', 
    server.address().port, app.settings.env);
})

//Creating websocket and sending randomly generated point to front-end 
var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 8080})
    wss.on('connection', function (ws) {
      ws.on('message', function (message) {
        console.log('received: %s', message)
      })
      ws.send(JSON.stringify(newMarker));
})


//Root display for application
app.get('/', (req, res) => {
	fs.readFile('index.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
  
})

//By Passing two random parameters, this functions creates some random 3d vector that will be the start
//point of our  satellite
var generateRandomVector = function(yRotate, zRotate){
  var initial = [1, 0, 0];
  var yMatrix = [ Math.cos(yRotate), 0, Math.sin(yRotate),
                  0, 1, 0,
                  (-1 * Math.sin(yRotate)), 0, Math.cos(yRotate)];
  var zMatrix = [ Math.cos(zRotate), (-1 * Math.sin(zRotate)), 0, 
                  Math.sin(zRotate), Math.cos(zRotate), 0, 
                  0, 0, 1 ];
  var firstCalculation = calculateRotationMatrix(yMatrix, initial);
  var result = calculateRotationMatrix(zMatrix, firstCalculation);
  console.log(result);
  return result;

}

//Generic function used to calculate a 3d vector with constant magnitude
var calculateRotationMatrix = function(rotationMatrix, startMatrix) {
  var resultMatrix = [parseFloat(((rotationMatrix[0]* startMatrix[0]) + (rotationMatrix[1]* startMatrix[1]) + (rotationMatrix[2]* startMatrix[2])).toFixed(4)),
                parseFloat(((rotationMatrix[3]* startMatrix[0]) + (rotationMatrix[4]* startMatrix[1]) + (rotationMatrix[5]* startMatrix[2])).toFixed(4)),
                parseFloat(((rotationMatrix[6]* startMatrix[0]) + (rotationMatrix[7]* startMatrix[1]) + (rotationMatrix[8]* startMatrix[2])).toFixed(4))];
  return resultMatrix;
}

//Creates a 2D lat, long coordinate from our random 3D vector
var newMarker = [];
var plotPoint = function() {
  var markerPoint = generateRandomVector(((Math.PI * Math.random()*2).toFixed(5)), ((Math.PI * Math.random()*2).toFixed(5)));
  newMarker.push(longitudeArctanCalculator(markerPoint[0], markerPoint[1]));
  newMarker.push(latitudeArctanCalculator(markerPoint[1], markerPoint[2]));
  console.log(newMarker);
}


//Returns a value from -180 - 180 that corresponds to the proper longitude of a 3D coordinate
var longitudeArctanCalculator = function(x, y) {
  var radianResult;
  var degreeResult;
  if(x > 0 && y > 0) {
    radianResult = Math.atan(y/x);
    degreeResult = (180/Math.PI)*radianResult;
    console.log(degreeResult);
    return degreeResult;
  }
  else if (x < 0 && y > 0) {
    radianResult = Math.atan(y/x) + Math.PI;
    degreeResult = (180/Math.PI)*radianResult;
    console.log(degreeResult);
    return degreeResult;
  }
  else if (x < 0 && y < 0) {
    radianResult = Math.atan(y/x) - Math.PI;
    degreeResult = (180/Math.PI)*radianResult;
    console.log(degreeResult);
    return degreeResult;
  }
  else if(x > 0 && y < 0) {
    radianResult = Math.atan(y/x);
    degreeResult = (180/Math.PI)*radianResult;
    console.log(degreeResult);
    return degreeResult;
  }
} 

//Returns a value from -90 - 90 that corresponds to the proper latitude of a 3D coordinate
var latitudeArctanCalculator = function(x, z) {
  var radianResult;
  var degreeResult;
  if(x > 0 && z > 0) {
    radianResult = Math.atan(z/x);
    degreeResult = (180/Math.PI)*radianResult;
    console.log(degreeResult);
    return degreeResult;
  }
  else if (x < 0 && z > 0) {
    radianResult = Math.atan(z/x);
    degreeResult = (-180/Math.PI)*radianResult;
    console.log(degreeResult);
    return degreeResult;
  }
  else if (x < 0 && z < 0) {
    radianResult = Math.atan(z/x);
    degreeResult = (-180/Math.PI)*radianResult;
    console.log(degreeResult);
    return degreeResult;
  }
  else if(x > 0 && z < 0) {
    radianResult = Math.atan(z/x);
    degreeResult = (180/Math.PI)*radianResult;
    console.log(degreeResult);
    return degreeResult;
  }
}

plotPoint();





