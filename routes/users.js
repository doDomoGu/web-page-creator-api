var express = require('express');
var router = express.Router();
var users = require('../models/users').users;
var config = require('config');
var redis   = require('redis');


var redisClient  = redis.createClient(config.get('redis.port'), config.get('redis.ip'));
var redisIndex = config.get('redis.index');
redisClient.select(redisIndex,function(error){
    if(error) {
        console.log(error);
    } else {
    }
});

redisClient.on("error", function(error) {
    console.log(error);
});




/*module.exports.list = function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.send(users);
};

module.exports.get = function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.send(users[req.param('id')]);
};*/


/*module.exports.delete = function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    delete users[req.param('id')];
    res.send({status:"success", message:"delete user success"});
    console.log(users);
};


module.exports.update = function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    users[req.body.id] = req.body;
    res.send({status:"success", message:"update user success"});
    console.log(users);
};


module.exports.add = function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    console.log(req.body);
    users[req.body.id] = req.body;
    res.send({status:"success", message:"add user success"});
    console.log(users);
};*/



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/:id', function(req, res, next) {
    var id = req.params.id;

    var res0 = res;
    redisClient.hmset('user:'+id, req.body, function(error, res) {
        if(error) {
            console.log(error);
        } else {
            console.log(res);
        }

        // 关闭链接
        //redisClient.end(redisIndex);
    });


    // get
    redisClient.hgetall('user:'+id, function(error, res){
        if(error) {
            console.log(error);
        } else {
            res0.send(res);
        }

        // 关闭链接
        //redisClient.end(redisIndex);


    });
    //res.setHeader('Content-Type', 'application/json;charset=utf-8');

    //res.send('respond with a resource');
});




router.get('/:id', function(req, res, next) {
    var res0 = res;
    redisClient.hgetall('user:'+req.params.id, function(error, res){
        if(error) {
            console.log(error);
        } else {
            res0.send(res);
        }

        // 关闭链接
        redisClient.end(redisIndex);
    });

    //res.setHeader('Content-Type', 'application/json;charset=utf-8');
    //res.send(users[req.param('id')]);
    //res.send('respond with a resource');
});

module.exports = router;
