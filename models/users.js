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

/*var auth_roles = {
    1:['super_admin'],
    2:['user_admin','website_admin'],
    3:['user_admin']
};*/

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
            user_info: {},
            roles : []
        };
        if(res.length == 1){
            var _res = res[0];

            if(res[0].password==data.password){



                result.success = true;
                result.error_msg = false;
                result.user_id = _res.id;
                result.user_info = _res;


                mysql.query('select ug.alias from `usergroup_user` ugu join `usergroup` ug on ugu.usergroup_id = ug.id where ugu.user_id = ? ',[_res.id], function (error, res) {
                    if (error) throw error;

                    var roles = [];
                    if(res.length>0) {

                        for (var i in res) {
                            roles.push(res[i].alias);
                        }
                    }

                    result.roles = roles;


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


                        return callback(null,result);
                        //return callback(null,{id:res.insertId});
                    });
                    //return callback(null,result);

                });

                //result.roles = auth_roles[_res.id]!=undefined?auth_roles[_res.id]:[];








            }else{
                result.error_msg = '用户名或密码错误 (001)';
                //return callback(null,{error:'don\'t find the user'});
                return callback(null,result);
            }

        }else{
            //return callback(null,{error:'don\'t find the user'});
            result.error_msg = '用户名或密码错误 (002)';
            return callback(null,result);
        }

    });


};

users.getUserInfoByToken = function(data,callback){
    let token = data.token;

    let result = {
        success : false,
        token : '',
        user_id : 0,
        user_info: {},
        roles : []
    };


    let checkToken = function(token){

        return new Promise(function (resolve, reject) {

            mysql.query('select user_id,expired_time from `user_auth_token` where token = ?',[token], function (error, res) {

                if (error) {
                    return reject(error);
                } else {
                    let _result = {};

                    if(res.length === 1){

                        let _res = res[0];

                        if(new Date() < new Date(_res.expired_time)){
                            _result.success = true;
                            _result.token = token;
                            _result.user_id = _res.user_id;
                        }
                    }

                    return resolve(_result);
                }
            });
        });
    };

    let getUserinfo = function(user_id){
        return new Promise(function (resolve, reject) {
            mysql.query('select name,mobile from `user` where id = ? ',[user_id], function (error, res) {
                if (error){
                    return reject(error);
                }else {
                    let user_info = {};
                    if (res.length === 1) {
                        let _res = res[0];
                        for (let i in _res) {
                            if (_res.hasOwnProperty(i)) {
                                user_info[i] = _res[i];
                            }
                        }
                    }
                    return resolve(user_info);
                }
            })
        });
    };

    let getRoles = function(user_id){

        return new Promise(function (resolve, reject) {
            mysql.query('select ug.alias from `usergroup_user` ugu join `usergroup` ug on ugu.usergroup_id = ug.id where ugu.user_id = ? ',[user_id], function (error, res) {
                if (error){
                    return reject(error);
                }else {
                    let roles = [];
                    if (res.length > 0) {
                        for (let i in res) {
                            if (res.hasOwnProperty(i)) {
                                roles.push(res[i].alias);
                            }
                        }
                    }
                    return resolve(roles);
                }
            })
        });
    };

    return async function () {
        let _result = await checkToken(token);
        for(let i in _result){
            if(_result.hasOwnProperty(i) && result.hasOwnProperty(i)){
                result[i] = _result[i];
            }
        }

        result.user_info = await getUserinfo(result.user_id);

        result.roles = await getRoles(result.user_id);

        return callback(null,result);
    }();


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
    let user_id = id;
    //var user_ids = data.user_ids;
    //var user_id_arr = user_ids.split(',');

    //var that = this;

    let result = {
        success : false,
        user_id : 0,
        usergroup_ids : []
    };

    let p = function(user_id){
        return new Promise(function (resolve, reject) {
            mysql.query('select * from `usergroup_user` where user_id = ? ',[user_id], function (error, res) {
                if (error){
                    return callback(null,error);
                }

                let usergroup_ids = [];

                for(let i in res){
                    if(res.hasOwnProperty(i)){
                        usergroup_ids.push(res[i].usergroup_id);
                    }
                }

                let r = {};

                r.success = true;
                r.user_id = user_id;
                r.usergroup_ids = usergroup_ids;

                return resolve(r);

            });
        })
    }

    p(user_id)
        .then(r=>{
            for(let i in r){
                if(r.hasOwnProperty(i) && result.hasOwnProperty(i)){
                    result[i] = r[i];
                }
            }

            return callback(null,result);
        });


};
users.getUsergroupsSet = function(query,callback){
    let user_ids = query.userids;

    let user_id_arr = user_ids?user_ids.split(','):[];



    let result = {
        success : false,
        data : []
    };

    let getUsergroup = function(){
        return new Promise(function (resolve, reject) {
            mysql.query('select * from `usergroup` ', function (error, res) {
                if (error) {
                    return callback(null, error);
                }

                let usergroups = [];

                for (let i in res) {
                    if (res.hasOwnProperty(i)) {
                        usergroups[res[i].id] = res[i].name;
                    }
                }
                return resolve(usergroups);
            })
        })
    };

    let getUsergroupUser = function(user_id_arr,usergroups){

        return new Promise(function (resolve, reject) {
            mysql.query('select * from `usergroup_user` where user_id in (?) ',[user_id_arr], function (error, res) {
                if (error){
                    return callback(null,error);
                }

                let data = [];

                for(let i in res){
                    if(res.hasOwnProperty(i)){
                        if(!data[res[i].user_id]){
                            data[res[i].user_id] = [];
                        }
                        let groupname = usergroups[res[i].usergroup_id];
                        if(groupname)
                            data[res[i].user_id].push(groupname);
                    }
                }

                let r = {};

                r.success = true;

                r.data = data;

                return resolve(r);

            });
        })
    };

    getUsergroup()
        .then(usergroups=>getUsergroupUser(user_id_arr,usergroups))
        .then(r=>callback(null,r));

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
