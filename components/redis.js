var redis = require('redis');
var config = require('config');
var redisConfig = config.get('redis');

var options = {
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password
};

var client = redis.createClient(options);
var dbIndex = redisConfig.index;
client.on('ready', function () {
    console.log('redis connected');
});
if(options.password){
    client.auth(options.password,function(){
        console.log('redis auth success');
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