// no comments!
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('/dev/ttyUSB0')

const parser = port.pipe(new Readline({ delimiter: '\r\n' }))

var params;

// console.log(parser)

// parser.on('data', console.log)
 
  parser.on('data', gps);

  function gps(data) {
    // console.log(data);
    var gps = data.split(",");
    if (gps[0] == "$GPRMC") {
      // console.log("=================");
      // console.log(`Protocol-> ${gps[0]}`);
      // console.log(`Time is-> ${gps[1]}`);
      // console.log(`Status-> ${gps[2]}`);
      // console.log(`Latitude-> ${gps[3]}, ${gps[4]}`);
      // console.log(`Longitude-> ${gps[5]}, ${gps[6]}`);
      // console.log(`Speed-> ${gps[7]}`);
      // console.log(`Angle-> ${gps[8]}`);
      // console.log(`Date-> ${gps[9]}`);
      // console.log(`Variation-> ${gps[10]}, ${gps[11]}`);
      // console.log(`Checksum-> ${gps[12]}`);
      // console.log("=================");
     params = {
        status: gps[2],
        latitude: gps[3],
        latNS: gps[4],
        longitude: gps[5],
        lonEW: gps[6]
      }
    }
    return params;
  };

 setInterval(function () { 
    console.log("===========");
    console.log(params.status);
    console.log(params.latitude);
    console.log(params.latNS);
    console.log(params.longitude);
    console.log(params.lonEW);
}, 5000); 
