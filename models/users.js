var redisClient = require('../components/redis');
var models = require('./_models');
var jwt = require('jsonwebtoken');


var users = new models(
    'users',
    {
        username: "",
        password: "",
        sex: 0,
        birthday: '',
        email: '',
        status: 1
    }
);
users.auth = function(data,callback){
    redisClient.hgetall(users.modelName, function(error, res){
        if(error) {
            console.log(error);
        } else {
            var result = {
                error_msg : '位置错误',
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
                            result.token = jwt.sign(
                                {
                                    user_id:_res.id
                                },
                                Math.floor(Math.random()*(10000-10+1)+10).toString(),
                                {
                                    expiresIn: 60*60*24  // 24小时过期
                                }
                            );
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
    });
};


module.exports = users;
