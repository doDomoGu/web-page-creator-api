var redisClient = require('../components/redis');

module.exports.list = function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.send(users);
};

module.exports.get = function(id,callback){
    redisClient.hgetall('users', function(error, res){
        if(error) {
            console.log(error);
        } else {
            var result;
            if(res[id]){
                result = JSON.parse(res[id]);
            }else{
                result = [];
            }
            callback(null,result);
        }
    });
};

module.exports.add = function(data,callback){

    redisClient.hlen('users',function(error,res){
        if(error) {
            console.log(error);
        } else {
            //console.log(res);
            //var len = res;
            var sub_key = res +1;
            redisClient.hset('users', sub_key , JSON.stringify(data) , function(error, res) {
                if (error) {
                    console.log(error);
                } else {
                    //console.log(res);

                    callback(null,{id:sub_key});
                }
            })

            /*
            redisClient.hgetall('users', function(error, res) {
                if(error) {
                    console.log(error);
                } else {
                    console.log(res);
var sub_key;
                    if(res==null){
                        sub_key = 1;

                    }else{

                    }
                }
            })*/
        }
    });
/*

    redisClient.hmset('user:'+id, req.body, function(error, res) {
        if(error) {
            console.log(error);
        } else {
            console.log(res);
        }

        // 关闭链接
        //redisClient.end(redisIndex);
    });

    callback(null,123);*/

    /*users[req.body.id] = req.body;
    res.send({status:"success", message:"add user success"});
    console.log(users);

    redisClient.hmset('user:'+id, req.body, function(error, res) {
        if(error) {
            console.log(error);
        } else {
            console.log(res);
        }

        // 关闭链接
        //redisClient.end(redisIndex);
    });
*/
};


module.exports.delete = function(req, res){
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




