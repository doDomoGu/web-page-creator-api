var mysql = require('../components/mysql');

function _models(modelName,model,required){
    this.modelName = modelName;
    this.model = model;
    this.required = required;

    var that = this;

    this.list = function(query,callback) {
        var sql = 'SELECT * FROM `' + this.modelName + '`';
        if(JSON.stringify(query)!=='{}'){
            sql += ' WHERE 1 = 1 ';
            for(var i in query){
          //TODO 使用不同的判断符号
                //console.log(i,query[i],typeof query[i]);
                if(query[i]){
                    sql += ' AND `'+i+'` like '+mysql.escape('%'+query[i]+'%');
                }
            }
        }
        //console.log(sql);
        mysql.query(sql, function (error, res) {
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
            return callback(null, result);
        });
    };

    this.get = function(id,callback){
        mysql.query('SELECT * FROM `' + this.modelName + '` WHERE id = ?',[id], function (error, res) {
            if (error) throw error;
            if(res.length == 0){
                return callback(null,{error:'not exist'});
            }

            var result = {};
            for(var i in model){
                //result[i] = res[0][i]!=undefined?res[0][i]:this.model[i];
                result[i] = res[0][i];
            }
            return callback(null,result);
        });
    };

    this.add = function(data,callback){
        var dataOne = {};

        //过滤model中定义的字段
        for(var i in this.model){
            if(data[i]!=undefined){
                dataOne[i] = data[i];
            }
        }

        //判断必填字段
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

            return callback(null,{id:res.insertId});
        });
    };


    this.delete = function(id,callback){
        //检查是否存在
        mysql.query('SELECT * FROM `' + this.modelName + '` WHERE id = ?',[id], function (error, res) {
            if (error) throw error;

            if(res.length == 0){
                return callback(null,{error:'not exist'});
            }
            //更新
            mysql.query('UPDATE `' + that.modelName + '` SET `status` = 0 WHERE id = ?',[id], function (error, res) {
                if (error) throw error;

                return callback(null,{id:id,status:0});
            });
        });
    };


    this.update = function(id, dataNew, callback){
        //检查是否存在
        mysql.query('SELECT * FROM `' + this.modelName + '` WHERE id = ?',[id], function (error, res) {
            if (error) throw error;

            if(res.length == 0){
                return callback(null,{error:'not exist'});
            }
            var dataOne = {};
            //过滤字段
            for(var i in that.model){
                if(dataNew[i]!=undefined){
                    dataOne[i] = dataNew[i];
                }
            }

            //更新
            mysql.query('UPDATE `' + that.modelName + '` SET ? WHERE id = ?',[dataOne,id], function (error, res) {
                if (error) throw error;

                return callback(null,{id:id,update:'success'});
            });
        });
    };
}

module.exports = _models;




