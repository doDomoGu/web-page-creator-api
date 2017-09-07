var mysql = require('../components/mysql');

function _models(modelName,model,required){
    this.modelName = modelName;
    this.model = model;
    this.required = required;

    var that = this;

    this.list = function(query,callback) {
        var sql = 'SELECT * FROM `' + this.modelName + '`';
        var sqlCount = 'SELECT count(id) as `total_count` FROM `' + this.modelName + '`';
        var where = ' WHERE 1 = 1 ';

        var page = 1;
        var pageSize = 10;

        if(JSON.stringify(query)!=='{}'){

            for(var i in query){
          //TODO 使用不同的判断符号
                //console.log(i,query[i],typeof query[i]);
                if(i=='page'){
                    page = parseInt(query[i]);
                }else if(i=='pageSize'){
                    pageSize = parseInt(query[i]);
                }else if(query[i]){
                    where += ' AND `'+i+'` like '+mysql.escape('%'+query[i]+'%');
                }
            }
        }

        mysql.query(sqlCount + where, function (error, res) {
            if (error) throw error;

            var total_count = res[0].total_count;

            var limit = ' limit '+(page>1?parseInt((page-1)*pageSize):0)+','+pageSize;


            mysql.query(sql + where + limit, function (error, res) {
                if (error) throw error;

                var data = [];

                if (!!res) {
                    for (var i in res) {
                        var resOne = {};
                        for (var j in model) {
                            //resOne[j] = res[i][j] != undefined ? res[i][j] : this.model[j];
                            resOne[j] = res[i][j];
                        }
                        data.push(resOne);
                    }
                }
                return callback(null,{total_count:total_count,data:data,page:page,pageSize:pageSize});
            });

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




