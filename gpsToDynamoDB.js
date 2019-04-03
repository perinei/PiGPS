var docClient; // AWS.DynamoDB.DocumentClient()
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
docClient = new AWS.DynamoDB.DocumentClient();

var gpsd = require('node-gpsd');

var params = {};

var daemon = new gpsd.Daemon({
    program: 'gpsd',
    device: '/dev/ttyACM0',
    port: 2947,
    pid: '/tmp/gpsd.pid',
    readOnly: false,
    logger: {
        info: function() {},
        warn: console.warn,
        error: console.error
    }
});

daemon.start(function() {
    var listener = new gpsd.Listener();

    listener.on('TPV', function (tpv) {
        // console.log(tpv);

        params=tpv;        
    });

    listener.connect(function() {
        listener.watch();
    });
});

// function reg (tpv) {
//     console.log(`lat: ${tpv.lat}!`);
//     console.log(`lon: ${tpv.lon}!`);
//     console.log("=============================");
// }

function writeToDynamoDB(vparams) { // putItem on dynamoDB table
  var d = new Date();
  var seconds = Math.round(d.getTime() / 1000);
  
  var vparams = {
    Item: {
     "tracker_id": "FFADSDFEWR",
     "date_time": seconds,
     "mode": vparams.mode,
     "Lat": vparams.lat,
     "Lon": vparams.lon     
    },     
    ReturnConsumedCapacity: "TOTAL", 
    TableName: "tracker"
   };

   docClient.put(vparams, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response  
 });
}

setInterval (function(){
    console.log(`mode: ${params.mode}`);
    console.log(`lat: ${params.lat}`);
    console.log(`lon: ${params.lon}`);
    console.log("=============================");
    writeToDynamoDB(params);
}, 5000);
