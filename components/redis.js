var redis = require('redis');
var config = require('config');
var options = {
    host: config.get('redis.host'),
    port: config.get('redis.port')
};
var client = redis.createClient(options);
var dbIndex = config.get('redis.index');
client.on('ready', function () {
    console.log('redis connected');
});

client.select(dbIndex,function(error){
    if(error) {
        console.log(error);
    } else {
        console.log('redis db select ('+dbIndex+')')
    }
});
module.exports = client;