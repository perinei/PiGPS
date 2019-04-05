// gps is awsome
var gpsd = require('node-gpsd');

var params = {};

var daemon = new gpsd.Daemon({
    program: 'gpsd',
    device: '/dev/ttyUSB0',
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
        console.log(tpv);

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

setInterval (function(){
    console.log(`mode: ${params.mode}`);
    console.log(`lat: ${params.lat}`);
    console.log(`lon: ${params.lon}`);
    console.log("=============================");
}, 5000);
