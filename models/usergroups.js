var models = require('./_models');
var mysql = require('../components/mysql');

var usergroups = new models(
    'usergroup',
    {
        id: 0,
        name:"",
        alias: "",
        remark: "",
        status: 0
    },
    [
        'name',
        'alias'
    ]
);

usergroups.getUsersSet = function(query,callback){
    var usergroup_ids = query.usergroup_ids;

    var usergroup_id_arr = usergroup_ids?usergroup_ids.split(','):[];


    var that = this;

    var result = {
        success : false,
        data : []
    };

    mysql.query('select * from `user` ', function (error, res) {
        if (error){
            return callback(null,error);
        }

        var users = [];

        for(var i in res){
            users[res[i].id] = res[i].id;
        }

        mysql.query('select * from `usergroup_user` where usergroup_id in (?) ',[usergroup_id_arr], function (error, res) {
            if (error){
                return callback(null,error);
            }

            var data = [];

            for(var i in res){
                if(!data[res[i].usergroup_id]){
                    data[res[i].usergroup_id] = [];
                }
                var user_id = users[res[i].user_id];
                if(user_id)
                    data[res[i].usergroup_id].push(user_id);
            }

            result.success = true;
            result.data = data;

            return callback(null,result);

        });
    });
};


usergroups.setUser = function(id,data,callback){
    var usergroup_id = id;
    var user_ids = data.user_ids;
    var user_id_arr = user_ids.split(',');

    var that = this;

    var result = {
        success : false,
        usergroup_id : 0,
        user_ids : []
    };
    mysql.query('delete from `usergroup_user` where usergroup_id = ? and user_id not in (?)',[usergroup_id,user_id_arr], function (error, res) {
        if (error){
            return callback(null,error);
        }

        var insertData = [];



        for(var i in user_id_arr){
            insertData.push('('+user_id_arr[i]+','+usergroup_id+')');
        }


        mysql.query('insert ignore into `usergroup_user` (user_id,usergroup_id) values '+ insertData.join(','), function (error, res) {
            if (error){
                return callback(null,error);
            }

            result.success = true;
            result.usergroup_id = usergroup_id;
            result.user_ids = user_ids;

            return callback(null,result);

        })
    });
};



usergroups.getUser = function(id,query,callback){
    var usergroup_id = id;
    //var user_ids = data.user_ids;
    //var user_id_arr = user_ids.split(',');

    var that = this;

    var result = {
        success : false,
        usergroup_id : 0,
        user_ids : []
    };
    mysql.query('select * from `usergroup_user` where usergroup_id = ? ',[usergroup_id], function (error, res) {
        if (error){
            return callback(null,error);
        }

        var user_ids = [];

        for(var i in res){
            user_ids.push(res[i].user_id);
        }

        result.success = true;
        result.usergroup_id = usergroup_id;
        result.user_ids = user_ids;

        return callback(null,result);

    });
};

module.exports = usergroups;
