var redis = require('redis');
var config = require('config');
var options = {
    host: config.get('redis.host'),
    port: config.get('redis.port'),
    password: config.get('redis.password')
};
var client = redis.createClient(options);
var dbIndex = config.get('redis.index');
client.on('ready', function () {
    console.log('redis connected');
});
if(options.password){
    client.auth(options.password,function(){
        console.log('通过认证');
    });
}

client.select(dbIndex,function(error){
    if(error) {
        console.log(error);
    } else {
        console.log('redis db select ('+dbIndex+')')
    }
});
module.exports = client;