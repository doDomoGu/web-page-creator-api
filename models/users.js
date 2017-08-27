var redisClient = require('../components/redis');
var models = require('./_models');
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
    var tokenExist = false;
    redisClient.hgetall('wpc_jwt', function(error, res){
        if(error) {
            console.log(error);
        } else {
            for(var i in res){
                if(i==token){
                    tokenExist = true;
                }
            }
        }
    });

    if(tokenExist){
        token = generateToken(user_id);
    }

    return token;
}


users.auth = function(data,callback){
    redisClient.hgetall(users.modelName, function(error, res){
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
    });
};

users.getUserInfoByToken = function(data,callback){
    var token = data.token;

    redisClient.hgetall('wpc_jwt', function(error, res) {
        var result = {
            success : false,
            token : '',
            user_id : 0,
            roles : []
        };

        for(var i in res){
            if(i==token){
                var _res = JSON.parse(res[i]);
                result.success = true;
                result.token = token;
                result.user_id = _res.user_id;
                result.roles = _res.roles;
            }
        }
        callback(null,result);
    })


}


module.exports = users;
