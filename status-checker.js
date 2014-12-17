var request = require('request');

var serverCallback = function(topLevel, address, status) {
  return function(error, response, body) {
    if (!error) {
      if (response.statusCode == status) {
        console.log("OK :: Connected to " + address + ", with status: " +
          response.statusCode);
      } else {
        console.log("ERROR :: Connected to " + address +
          ", but with wrong status:  " + response.statusCode +
          ", expected: " + status);
      }
    } else {
      console.log("ERROR :: Can't connect to " + address + ", reason: " +
        error);
    }
    setImmediate(topLevel);
  };
};

var callAddresses = function() {
  var address = addresses.pop();
  if (address) {
    request(address, serverCallback(callAddresses, address, servers[address]));
  }
};



var argv = require('optimist')
  .usage('Usage: $0 -s [server-list.json]')
  .demand(['s'])
  .argv;

var servers = require("./" + argv.s);

var addresses = Object.keys(servers);

callAddresses();
