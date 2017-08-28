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
                expired_time += "-"+(expired.getMonth()+1 < 10 ? '0' + (expired.getMonth()+1) : (expired.getMonth()+1));
                expired_time += "-"+(expired.getDate() < 10 ? '0' + expired.getDate() : expired.getDate());
                expired_time += " "+expired.getHours();
                expired_time += ":"+expired.getMinutes();
                expired_time += ":"+expired.getSeconds();


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
            result.success = true;
            result.token = token;
            result.user_id = res[0].user_id;
            result.roles = auth_roles[res[0].user_id];
        }


        return callback(null,result);
    });
}


module.exports = users;
