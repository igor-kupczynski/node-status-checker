var request = require('request');

var serverCallback = function(address, status) {
    return function(error, response, body) {
        if (!error) {
            if (response.statusCode == status) {
                results.push({
                    "status": "CONNECTED_OK",
                    "address": address,
                    "got": response.statusCode,
                    "expected": status
                });
            } else {
                results.push({
                    "status": "CONNECTED_WRONG_STATUS",
                    "address": address,
                    "got": response.statusCode,
                    "expected": status
                });
            }
        } else {
            results.push({
                "status": "CAN'T CONNECT",
                "address": address,
                "got": error.code,
                "expected": status
            });
        }
        setImmediate(callAddresses);
    };
};

var done = function() {
    console.log(results);
}

var callAddresses = function() {
    var address = addresses.pop();
    if (address) {
        request(address, serverCallback(address, servers[address]));
    } else {
        done();
    }
};

var argv = require('optimist')
        .usage('Usage: $0 -s [server-list.json]')
        .demand(['s'])
        .argv;

var servers = require("./" + argv.s);
var results = [];

var addresses = Object.keys(servers);

callAddresses();
