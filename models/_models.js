
var mysql = require('../components/mysql')

function _models(modelName,model,required){
    this.modelName = modelName;
    this.model = model;
    this.required = required;

    this.list = function(callback) {
        mysql.query('SELECT * FROM `' + this.modelName + '`', function (error, res) {
            if (error) throw error;

            var result = [];

            if (!!res) {
                for (var i in res) {
                    var resOne = {};
                    for (var j in model) {
                        //resOne[j] = res[i][j] != undefined ? res[i][j] : this.model[j];
                        resOne[j] = res[i][j];
                    }
                    result.push(resOne);
                }
            }
            callback(null, result);
        });
    };

    this.get = function(id,callback){
        mysql.query('SELECT * FROM `' + this.modelName + '` WHERE id = ?',[id], function (error, res) {
            if (error) throw error;

            var result = {};

            if(res.length==1){
                for(var i in model){
                    //result[i] = res[0][i]!=undefined?res[0][i]:this.model[i];
                    result[i] = res[0][i];
                }
            }
            callback(null,result);
        });
    };

    this.add = function(data,callback){
        var dataOne = {};
        for(var i in this.model){
            if(data[i]!=undefined){
                dataOne[i] = data[i];
            }
        }

        var requiredErr = {};
        for(var j in this.required){
            var _key =this.required[j];
            if(dataOne[_key]==undefined){
                requiredErr[_key] = 'is required';
            }
        }

        if(JSON.stringify(requiredErr)!=='{}'){
            return callback(null,requiredErr);
        }

        mysql.query('INSERT INTO `' + this.modelName + '` SET ?',dataOne, function (error, res) {
            if (error) throw error;

            /*var result = {};

            if(res.length==1){
                for(var i in model){
                    result[i] = res[0][i]!=undefined?res[0][i]:model[i];
                }
            }*/
            callback(null,{id:res.insertId});
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




