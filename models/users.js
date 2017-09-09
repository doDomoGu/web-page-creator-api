//var redisClient = require('../components/redis');
var models = require('./_models');
var mysql = require('../components/mysql');
var jwt = require('jsonwebtoken');

var users = new models(
    'user',
    {
        id: 0,
        username: "",
        password: "",
        name:"",
        mobile: "",
        email: "",
        status: 0,
        verify: 0
    },
    [
        'username',
        'password',
        'name',
        'mobile'
    ]

);

var auth_roles = {
    1:['super_admin'],
    2:['user_admin','website_admin'],
    3:['user_admin']
};

function generateToken(user_id){
    var token = jwt.sign(
            {
                user_id:user_id
            },
            Math.floor(Math.random()*(10000-10+1)+10).toString(),
            {
                expiresIn: 60*60*24  // 24小时过期
            }
        );
    //#######  忽略重复token的问题  ########

    /*var tokenExist = false;

    mysql.query('SELECT * FROM `user_auth_token` where token = ?',token, function (error, res) {
        if (error) throw error;

    });


    if(tokenExist){
        token = generateToken(user_id);
    }

    */

    return token;
}


users.auth = function(data,callback){
    var that = this;

    //查用户名
    mysql.query('SELECT * FROM `' + that.modelName + '` where username = ?',data.username, function (error, res) {
        if (error){
            return callback(error);
        }
        var result = {
            error_msg : '未知错误',
            success : false,
            token : '',
            user_id : 0,
            roles : []
        };
        if(res.length == 1){
            var _res = res[0];

            if(res[0].password==data.password){
                result.success = true;
                result.error_msg = false;
                result.user_id = _res.id;
                result.roles = auth_roles[_res.id]!=undefined?auth_roles[_res.id]:[];
                var token = generateToken(_res.id);
                result.token = token;
                var expired = new Date(new Date().getTime() + 60*60*24*1000);

                var expired_time = '';
                expired_time += expired.getFullYear();
                expired_time += "-"+ (expired.getMonth()+1 < 10 ? '0' + (expired.getMonth()+1) : (expired.getMonth()+1));
                expired_time += "-"+ (expired.getDate() < 10 ? '0' + expired.getDate() : expired.getDate());
                expired_time += " "+ (expired.getHours() < 10 ? '0' + expired.getHours() : expired.getHours());
                expired_time += ":"+ (expired.getMinutes() < 10 ? '0' + expired.getMinutes() : expired.getMinutes());
                expired_time += ":"+ (expired.getSeconds() < 10 ? '0' + expired.getSeconds() : expired.getSeconds());


                mysql.query('INSERT INTO `user_auth_token` SET ?',{user_id:_res.id,token:token,expired_time:expired_time}, function (error, res) {
                    if (error) throw error;

                    //return callback(null,{id:res.insertId});
                });





            }else{
                result.error_msg = '用户名或密码错误 (001)';
                //return callback(null,{error:'don\'t find the user'});
            }

        }else{
            //return callback(null,{error:'don\'t find the user'});
            result.error_msg = '用户名或密码错误 (002)';
        }
        return callback(null,result);
    });

    /*redisClient.hgetall(users.modelName, function(error, res){
        if(error) {
            console.log(error);
        } else {
            var result = {
                error_msg : '未知错误',
                success : false,
                token : '',
                user_id : 0,
                roles : []
            };
            var nameflag = false; //是否找到用户名

            for(var i in res){
                if(!nameflag) {
                    var _res = JSON.parse(res[i]);
                    if (_res.username == data.username) {
                        nameflag = true;
                        if (_res.password == data.password) {
                            result.success = true;
                            result.error_msg = false;
                            result.user_id = i;
                            result.roles = auth_roles[i]!=undefined?auth_roles[i]:[];
                            var token = generateToken(i);
                            result.token = token;
                            redisClient.hset('wpc_jwt', token , JSON.stringify({user_id:result.user_id,roles:result.roles}) , function(error, res) {
                                if (error) {
                                    console.log(error);
                                }
                            })


                        } else {
                            result.error_msg = '用户名或密码错误 (001)';
                        }
                    }
                }
            }

            if(!nameflag){
                result.error_msg = '用户名或密码错误 (002)';
                //callback(null,{msg:'用户名或密码错误'});
            }


            callback(null,result);
        }
        //callback(error,{});
    });*/
};

users.getUserInfoByToken = function(data,callback){
    var token = data.token;
    var result = {
        success : false,
        token : '',
        user_id : 0,
        roles : []
    };
    mysql.query('select * from `user_auth_token` where token = ?',[token], function (error, res) {
        if (error) throw error;

        if(res.length==1){
            var expired = new Date(res[0].expired_time);
            var now = new Date();
            if(now < expired){
                result.success = true;
                result.token = token;
                result.user_id = res[0].user_id;
                result.roles = auth_roles[res[0].user_id];
            }
        }


        return callback(null,result);
    });
};
users.deleteToken = function(data,callback){
    var token = data.token;
    var result = {
        success : false
    };
    mysql.query('select * from `user_auth_token` where token = ?',[token], function (error, res) {
        if (error) throw error;

        if(res.length==1){
            var expired = new Date(new Date().getTime() - 1000);

            var expired_time = '';
            expired_time += expired.getFullYear();
            expired_time += "-"+ (expired.getMonth()+1 < 10 ? '0' + (expired.getMonth()+1) : (expired.getMonth()+1));
            expired_time += "-"+ (expired.getDate() < 10 ? '0' + expired.getDate() : expired.getDate());
            expired_time += " "+ (expired.getHours() < 10 ? '0' + expired.getHours() : expired.getHours());
            expired_time += ":"+ (expired.getMinutes() < 10 ? '0' + expired.getMinutes() : expired.getMinutes());
            expired_time += ":"+ (expired.getSeconds() < 10 ? '0' + expired.getSeconds() : expired.getSeconds());

            mysql.query('UPDATE `user_auth_token` SET expired_time = ? where id = ?',[expired_time,res[0].id], function (error, res) {
                if(error){
                    return callback(error);
                }else{

                    result.success = true;

                    return callback(null,result);
                }
            })
        }else{
            result.success = true;

            return callback(null,result);
        }
    });
};

users.getUsergroups = function(id,query,callback){
    var user_id = id;
    //var user_ids = data.user_ids;
    //var user_id_arr = user_ids.split(',');

    var that = this;

    var result = {
        success : false,
        user_id : 0,
        usergroup_ids : []
    };
    mysql.query('select * from `usergroup_user` where user_id = ? ',[user_id], function (error, res) {
        if (error){
            return callback(null,error);
        }

        var usergroup_ids = [];

        for(var i in res){
            usergroup_ids.push(res[i].usergroup_id);
        }

        result.success = true;
        result.user_id = user_id;
        result.usergroup_ids = usergroup_ids;

        return callback(null,result);

    });

};
users.getUsergroupsSet = function(query,callback){
    var user_ids = query.userids;

    var user_id_arr = user_ids?user_ids.split(','):[];


    var that = this;

    var result = {
        success : false,
        data : []
    };

    mysql.query('select * from `usergroup` ', function (error, res) {
        if (error){
            return callback(null,error);
        }

        var usergroups = [];

        for(var i in res){
            usergroups[res[i].id] = res[i].name;
        }

        mysql.query('select * from `usergroup_user` where user_id in (?) ',[user_id_arr], function (error, res) {
            if (error){
                return callback(null,error);
            }

            var data = [];

            for(var i in res){
                if(!data[res[i].user_id]){
                    data[res[i].user_id] = [];
                }
                var groupname = usergroups[res[i].usergroup_id];
                if(groupname)
                    data[res[i].user_id].push(groupname);
            }

            result.success = true;
            //result.user_id = user_id;
            //result.usergroup_ids = usergroup_ids;
            result.data = data;

            return callback(null,result);

        });
    });
};


users.setUsergroups = function(id,data,callback){
    var user_id = id;
    var usergroup_ids = data.usergroup_ids;
    var that = this;

    var result = {
        success : false,
        user_id : 0,
        usergroup_ids : []
    };
    mysql.query('delete from `usergroup_user` where user_id = ? and usergroup_id not in (?)',[user_id,usergroup_ids], function (error, res) {
        if (error){
            return callback(null,error);
        }

        var insertData = [];

        for(var i in usergroup_ids){
            insertData.push('('+user_id+','+usergroup_ids[i]+')');
        }


        mysql.query('insert ignore into `usergroup_user` (user_id,usergroup_id) values '+ insertData.join(','), function (error, res) {
            if (error){
                return callback(null,error);
            }

            result.success = true;
            result.user_id = user_id;
            result.usergroup_ids = usergroup_ids;

            return callback(null,result);

        })
    });
};

module.exports = users;
