
module.exports.run = function (store) {
    var mqtt    = require('mqtt');
    // define connection to MQTT server
    var client  = mqtt.connect('mqtt://37.59.119.110',{ host: '37.59.119.110', port: 8888 });
    client.on('connect', function () {
        console.log("MQTT connection ready");
        client.subscribe("SERVER_A");
    });
    
    //####################################################
    store.on('subscribe',function(topic,message ){
        console.log('--STORE subscribe : ' + topic);
        console.log("");
    });
    
    store.on('unsubscribe',function(topic,message){
        console.log('--STORE unsubscribe : ' + topic);
        console.log("");
    });
    
    store.on('publish',function(topic,message){
        console.log('--STORE publish');
        console.log( JSON.stringify(
            {   "topic":topic, 
                "message":message
            } ));
        console.log("");
        
        // TODO: encrypt json before send node-rsa
        client.publish("SERVER_B",JSON.stringify(
            {   "topic":topic, 
                "message":message
            }));
    });
    //####################################################
    
    client.on("message", function (topic, message) {
      // message is Buffer 
      console.log("MQTT STORE MESSAGE ");
      console.log( message_object );
      console.log("        ");
      // TODO: decrypt string befor parse node-rsa
      var message_object = JSON.parse(message);
        
      if('login_pass' == message_object.topic){
        store.publish('login_rec',message_object.message);
      } else {
        store.publish( message_object.topic, message_object.message );
      }
    });
    
    
    client.on('close', function(){
        console.log("MQTT * close");
        client.end();
    });
    
    client.on('offline', function(){
        console.log('MQTT * offline');
        client.end();
    });
    
    client.on('error', function(){
        console.log('MQTT * error');
        client.end();
    });


    
};
