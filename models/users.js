var redisClient = require('../components/redis');

var user = {
    name: "",
    password: "",
    sex: 0,
    birthday: '',
    email: '',
    status: 1
};

module.exports.list = function(callback){
    redisClient.hgetall('users', function(error, res){
        if(error) {
            console.log(error);
        } else {
            var result = {};
            if(res!=null){
                for(var i in res){
                    var resTemp = JSON.parse(res[i]);
                    var resOne = {};
                    for(var j in user){
                        resOne[j] = resTemp[j]!=undefined?resTemp[j]:user[j];
                    }
                    result[i] = resOne;
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
            var result = {};
            if(res[id]){
                var resTemp = JSON.parse(res[id]);
                for(var i in user){
                    result[i] = resTemp[i]!=undefined?resTemp[i]:user[i];
                }
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
            //data.id = sub_key;

            var dataOne = {};
            for(var i in user){
                dataOne[i] = data[i]!=undefined?data[i]:user[i];
            }

            redisClient.hset('users', sub_key , JSON.stringify(dataOne) , function(error, res) {
                if (error) {
                    console.log(error);
                } else {
                    callback(null,{id:sub_key});
                }
            })
        }
    });
};


module.exports.delete = function(id,callback){
    redisClient.hgetall('users', function(error, res){
        if(error) {
            console.log(error);
        } else {
            if(res!=undefined && res[id]!=undefined){
                var data = JSON.parse(res[id]);
                data.status = 0;
                redisClient.hset('users', id , JSON.stringify(data) , function(error, res) {
                    if (error) {
                        console.log(error);
                    } else {
                        callback(null,{id:id,message:'delete ok!'});
                    }
                })
            }else{
                callback(null,{id:id,message:'id wrong'});
            }
        }
    });
};


module.exports.update = function(id, dataNew, callback){
    redisClient.hgetall('users', function(error, res){
        if(error) {
            console.log(error);
        } else {
            if(res!=undefined && res[id]!=undefined){
                var dataOld = JSON.parse(res[id]);
                var data = {};
                for(var i in user){
                    data[i] = dataOld[i]!=undefined?(dataNew[i]!=undefined?dataNew[i]:dataOld[i]):user[i];
                }
                redisClient.hset('users', id , JSON.stringify(data) , function(error, res) {
                    if (error) {
                        console.log(error);
                    } else {
                        callback(null,{id:id,message:'update ok!'});
                    }
                })
            }else{
                callback(null,{id:id,message:'id wrong'});
            }
        }
    });
};




