
var mysql = require('../components/mysql')

function _models(modelName,model){
    this.modelName = modelName;
    this.model = model;

    this.list = function(callback) {
        mysql.query('SELECT * FROM `' + this.modelName + '`', function (error, res, fields) {
            if (error) throw error;

            var result = [];

            if (res != null) {
                for (var i in res) {
                    var resOne = {};
                    for (var j in model) {
                        resOne[j] = res[i][j] != undefined ? res[i][j] : this.model[j];
                    }
                    result.push(resOne);
                }
            }
            callback(null, result);
        });
    };

    this.get = function(id,callback){
        redisClient.hgetall(modelName, function(error, res){
            if(error) {
                console.log(error);
            } else {
                var result = {};
                if(res[id]){
                    var resTemp = JSON.parse(res[id]);
                    for(var i in model){
                        result[i] = resTemp[i]!=undefined?resTemp[i]:model[i];
                    }
                }
                callback(null,result);
            }
        });
    };

    this.add = function(data,callback){
        redisClient.hlen(modelName,function(error,res){
            if(error) {
                console.log(error);
            } else {
                //res = 数据长度
                var sub_key = res + 1;
                //为data增加一个值 id
                //data.id = sub_key;

                var dataOne = {};
                for(var i in model){
                    dataOne[i] = data[i]!=undefined?data[i]:model[i];
                }

                redisClient.hset(modelName, sub_key , JSON.stringify(dataOne) , function(error, res) {
                    if (error) {
                        console.log(error);
                    } else {
                        callback(null,{id:sub_key});
                    }
                })
            }
        });
    };


    this.delete = function(id,callback){
        redisClient.hgetall(modelName, function(error, res){
            if(error) {
                console.log(error);
            } else {
                if(res!=undefined && res[id]!=undefined){
                    var data = JSON.parse(res[id]);
                    data.status = 0;
                    redisClient.hset(modelName, id , JSON.stringify(data) , function(error, res) {
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


    this.update = function(id, dataNew, callback){
        redisClient.hgetall(modelName, function(error, res){
            if(error) {
                console.log(error);
            } else {
                if(res!=undefined && res[id]!=undefined){
                    var dataOld = JSON.parse(res[id]);
                    var data = {};
                    for(var i in model){
                        data[i] = dataOld[i]!=undefined?(dataNew[i]!=undefined?dataNew[i]:dataOld[i]):model[i];
                    }
                    redisClient.hset(modelName, id , JSON.stringify(data) , function(error, res) {
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

}

module.exports = _models;




