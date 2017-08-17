var redisClient = require('../components/redis');
var models = require('./_models');



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
            var nameflag = false; //是否找到用户名
            var errormsg = '未知错误';
            var success = false;

            for(var i in res){
                if(!nameflag) {
                    var _res = JSON.parse(res[i]);
                    if (_res.username == data.username) {
                        nameflag = true;
                        if (_res.password == data.password) {
                            success = true;
                            errormsg = false;
                        } else {
                            errormsg = '用户名或密码错误 (001)';
                        }
                    }
                }
            }

            if(!nameflag){
                errormsg = '用户名或密码错误 (002)';
                //callback(null,{msg:'用户名或密码错误'});
            }

            callback(null,{errormsg:errormsg,success:success});
        }
        //callback(error,{});
    });
};


module.exports = users;
