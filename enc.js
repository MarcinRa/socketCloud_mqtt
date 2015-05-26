fs = require('fs');
var NodeRSA = require('node-rsa');

module.exports.readKey = function(path, callback) {
    fs.readFile(path, 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        callback(data);
    });
}

module.exports.doSign = function(content, privKey) {
    var key = new NodeRSA(privKey);
    return key.sign(content, 'base64');
}

module.exports.verify = function(content, sign, pubKey) {
    var key_p = new NodeRSA(pubKey);
    return key_p.verify(content, sign, 'utf8', 'base64');
}

module.exports.Encrypting = function(content, pubKey){
    	var key_p = new NodeRSA(pubKey);
	var counter = 0;
	var go = new Array();	
	while(counter <= content.length/128){
		var temp = content.slice(counter*128,(counter*128)+128)
		counter++;	
		var ex = key_p.encrypt(temp, 'base64');		
		go.push(ex);	
	}
    return go;
}

module.exports.Decrypting = function(content, privKey){
    var key_p = new NodeRSA(privKey);
    var str = ""
    for(var c = 0; c<content.length; c++){
	str += key_p.decrypt(content[c], 'utf8');
	}    
    return str;
}
