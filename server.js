var argv = require('minimist')(process.argv.slice(2));
var SocketCluster = require('socketcluster').SocketCluster;

if( process.argv.length == 4 ){

    var socketCluster = new SocketCluster({
      workers: Number(argv.w) || 1,
      stores: Number(argv.s) || 1,
      port: Number(argv.p) || parseInt(process.argv[2]),
      appName: argv.n || 'app',
      workerController: __dirname + '/worker.js',
      storeController: __dirname + '/'+process.argv[3],
      socketChannelLimit: 100,
      rebootWorkerOnCrash: !argv.debug
    });
    
} else {
    console.log("Arguments not reached :  node <server> <port> <store_file>");
}

