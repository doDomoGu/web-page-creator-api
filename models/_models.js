const mysql = require('../components/mysql');

function _models(modelName,model,required){
    this.modelName = modelName;
    this.model = model;
    this.required = required;

    const that = this;

    this.list = function(query,callback) {
        let sql = 'SELECT * FROM `' + this.modelName + '`';
        let sqlCount = 'SELECT count(id) as `total_count` FROM `' + this.modelName + '`';
        let where = ' WHERE 1 = 1 ';

        let page = 1;
        let pageSize = 10;

        if(JSON.stringify(query)!=='{}'){

            for(let i in query){
                if(query.hasOwnProperty(i)){
                    //TODO 使用不同的判断符号
                    //console.log(i,query[i],typeof query[i]);
                    if(i ==='page'){
                        page = parseInt(query[i]);
                    }else if(i ==='pageSize'){
                        pageSize = parseInt(query[i]);
                    }else if(query[i]){
                        where += ' AND `'+i+'` like '+mysql.escape('%'+query[i]+'%');
                    }
                }
            }
        }

        mysql.query(sqlCount + where, function (error, res) {
            if (error) throw error;

            let total_count = res[0].total_count;

            let limit = ' limit '+(page>1?parseInt((page-1)*pageSize):0)+','+pageSize;

            mysql.query(sql + where + limit, function (error, res) {

                if (error) throw error;

                let data = [];

                if (!!res) {
                    for (let i in res) {
                        if(res.hasOwnProperty(i)){
                            let resOne = {};
                            for (let j in model) {
                                if(model.hasOwnProperty(j)) {
                                    resOne[j] = res[i][j];
                                }
                            }
                            data.push(resOne);
                        }
                    }
                }
                return callback(null,{total_count:total_count,data:data,page:page,pageSize:pageSize});
            });
        });
    };

    this.get = function(id,callback){
        mysql.query('SELECT * FROM `' + this.modelName + '` WHERE id = ?',[id], function (error, res) {
            if (error) throw error;
            if(res.length === 0){
                return callback(null,{error:'not exist'});
            }

            let result = {};
            for(let i in model){
                if(model.hasOwnProperty(i)) {
                    result[i] = res[0][i];
                }
            }
            return callback(null,result);
        });
    };

    this.add = function(data,callback){
        let dataOne = {};

        //过滤model中定义的字段
        for(let i in this.model){
            if(this.model.hasOwnProperty(i)) {
                if (data.hasOwnProperty(i) && data[i] !== undefined) {
                    dataOne[i] = data[i];
                }
            }
        }

        //判断必填字段
        let requiredErr = {};
        for(let j in this.required){
            let _key = this.required[j];
            if(dataOne.hasOwnProperty(_key) && dataOne[_key] === undefined){
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

            if(res.length === 0){
                return callback(null,{error:'not exist'});
            }
            //更新
            mysql.query('UPDATE `' + that.modelName + '` SET `status` = 0 WHERE id = ?',[id], function (error) {
                if (error) throw error;

                return callback(null,{id:id,status:0});
            });
        });
    };


    this.update = function(id, dataNew, callback){
        //检查是否存在
        mysql.query('SELECT * FROM `' + this.modelName + '` WHERE id = ?',[id], function (error, res) {
            if (error) throw error;

            if(res.length === 0){
                return callback(null,{error:'not exist'});
            }
            let dataOne = {};
            //过滤字段
            for(let i in that.model){
                if(that.model.hasOwnProperty(i)){
                    if(dataNew.hasOwnProperty(i) && dataNew[i] !== undefined){
                        dataOne[i] = dataNew[i];
                    }
                }
            }

            //更新
            mysql.query('UPDATE `' + that.modelName + '` SET ? WHERE id = ?',[dataOne,id], function (error) {
                if (error) throw error;

                return callback(null,{id:id,update:'success'});
            });
        });
    };
}

module.exports = _models;




