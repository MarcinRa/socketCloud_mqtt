var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var levelup = require('level');
    

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

//  levelup for users login 
    var db = undefined;
    
    if(worker.options.sourcePort==8000)
        db = levelup('./mydb');
    else
        db = levelup('./mydb2');
    
//  database functions
    
    var addUserToDatabase = function(data){
        if(data!==undefined && data.username!==undefined && data.password!=undefined){
            db.get(data.username, function (err, value) {
              if (err) {
                if (err.notFound) {
                  db.put(data.username, data.password, function (err) {
                      if (err) return console.log('Ooops!', err) // some kind of I/O error
                      console.log(data.username+" stored in database");
                    });
                  return
                }
                // I/O or other error, pass it up the callback chain
                return console.log('Ooops  !', err)
              }
            });
            
        } else {
            console.log("No user or pass");
        }
    }
    
    var isUserRegistered = function(data,cb){
        if(data!=undefined)
            db.get(data.username, function (err, value) {
              if (err) {
                if (err.notFound) {
                  cb(false);
                  return
                }
                cb(false);
                // I/O or other error, pass it up the callback chain
                return console.log('Ooops  !', err)
              }
              if(value==data.password)
                cb(true);
            });
        else
            cb(false);
    }
    
//    Watched channals
//  ********************
    
    var ligin_rec = scServer.global.subscribe('login_rec');
    ligin_rec.watch(addUserToDatabase);
    

//    In here we handle our incoming realtime 
//    connections and listen for events.

    
    scServer.on('connection', function (socket) {
        
        socket.on('login', function (credentials, respond) {
            console.log("WORKER on login"); 
            console.log("");
            isUserRegistered(credentials,function(isRegistered){
                if (isRegistered) {
                      respond();
                      socket.setAuthToken({username: credentials.username, channels: ['log_list']});
                    } else {
                      // Passing string as first argument indicates error
                      respond('Login failed');
                    }
            });
        });
        
        socket.on('logout', function(cred,respond){
            socket.removeAuthToken();
            respond();
        });
        
        socket.on('register', function (credentials, respond) {
            console.log("WORKER on register"); 
            console.log("");
            addUserToDatabase(credentials);
            scServer.global.publish('login_pass', credentials);
            socket.setAuthToken({username: credentials.username, channels: ['log_list']});
            respond();
        });
        
        socket.on('who_am_I',function (data, respond) {
            console.log("WORKER who_am_I");
            var authToken = socket.getAuthToken();
            if( authToken.username != undefined ){
                respond();
                socket.emit('update_username',{username:authToken.username},function(err){
                    if (err) {
                        console.log(err);
                      } else {
                        //pass
                      }
                });}
            else
                respond("No registered user !!");
        });
        
        socket.on('disconnect', function () {
            //socket.removeAuthToken();
            console.log("disconnection");
        });
  });
    
    
//  Middleware set
    
  scServer.addMiddleware(scServer.MIDDLEWARE_EMIT,
      function (socket, event, data, next) {
      
        console.log('WORKER MIDDLEWARE_EMIT');
        console.log(event);
        console.log(data);
        console.log("");
        // ...
        if (1==1) {
          next() // Allow
        } else {
          next(socket.id + ' is not allowed to emit event ' + event); // Block
        }
      }
    );
    

    scServer.addMiddleware(scServer.MIDDLEWARE_PUBLISH, 
      function (socket, channel, data, next) {
          var authToken = socket.getAuthToken();
          console.log('WORKER MIDDLEWARE_PUBLISH');
          if (authToken) {
              console.log('channel: '+ channel);
              console.log('channel list: ' + authToken.channels.toString());
              console.log(data);
              data['username'] = authToken.username;
              console.log("");
              next();
          } else {
            next('You are not authorized to publish to ' + channel);
          }
    });
    
};


