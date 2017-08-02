var redisClient = require('../components/redis');

module.exports.list = function(callback){
    redisClient.hgetall('users', function(error, res){
        if(error) {
            console.log(error);
        } else {
            var result = {};
            if(res!=null){
                for(var i in res){
                    result[i] = JSON.parse(res[i]);
                }
            }
            callback(null,result);
        }
    });
};

module.exports.get = function(id,callback){
    redisClient.hgetall('users', function(error, res){
        if(error) {
            console.log(error);
        } else {
            var result = [];
            if(res[id]){
                result = JSON.parse(res[id]);
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
            //res = 数据长度
            var sub_key = res + 1;
            //为data增加一个值 id
            data.id = sub_key;
            redisClient.hset('users', sub_key , JSON.stringify(data) , function(error, res) {
                if (error) {
                    console.log(error);
                } else {
                    callback(null,{id:sub_key});
                }
            })
        }
    });
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




