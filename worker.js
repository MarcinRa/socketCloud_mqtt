var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');

module.exports.run = function (worker) {
  console.log('   >> Worker PID:', process.pid);
  
  var app = require('express')();
  
  // Get a reference to our raw Node HTTP server
  var httpServer = worker.getHTTPServer();
  // Get a reference to our realtime SocketCluster server
  var scServer = worker.getSCServer();
  
  app.use(serveStatic(path.resolve(__dirname, 'app')));
  app.use(serveStatic(path.resolve(__dirname, '.tmp')));
  httpServer.on('request', app);

  var count = 0;

  /*
    In here we handle our incoming realtime connections and listen for events.
  */
  scServer.on('connection', function (socket) {
    
      
    socket.on('log_list', function (data) {
      console.log( "odebrane przez worker ");
      console.log('log_list', data);
      //scServer.global.publish('log_list', data);
    });
//    
//    socket.on('ping', function (data) {
//      count++;
//      console.log('PING', data);
//      scServer.global.publish('pong', count);
//            
//    });
//    var interval = setInterval(function () {
//      socket.emit('rand', {
//        rand: Math.floor(Math.random() * 5)
//      });
//    }, 1000);
//    
    socket.on('disconnect', function () {
//      clearInterval(interval);
    });
  });
};