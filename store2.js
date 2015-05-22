module.exports.run = function (store) {
    var mqtt    = require('mqtt');
    // define connection to MQTT server
    var client  = mqtt.connect('mqtt://37.59.119.110',{ host: '37.59.119.110', port: 8888 });
    client.on('connect', function () {
        console.log("MQTT connection ready");
        client.subscribe("SERVER_B");
    });
    
    //####################################################
    store.on('subscribe',function(topic,message ){
        console.log('-- subscribe : ' + topic);
    });
    
    store.on('unsubscribe',function(topic,message){
        console.log('-- unsubscribe : ' + topic);
    });
    
    store.on('publish',function(topic,message){
        console.log('-- publish');
        console.log( JSON.stringify(
            {   "topic":topic, 
                "message":message
            } ));
        console.log("        ");
        client.publish("SERVER_A",JSON.stringify(
            {   "topic":topic, 
                "message":message
            }));
    });
    //####################################################
    
    
    client.on("message", function (topic, message) {
      // message is Buffer 
      console.log("MQTT STORE MESSAGE ");
      var message_object = JSON.parse(message);
//      store.publish( message_object.topic, message_object.message );
      console.log( message_object );
      console.log("        ");
      
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