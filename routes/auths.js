var express = require('express');
var router = new express.Router();

var users = require('../models/users');

//验证登录
router.post('/', function(req, res) {
    users.auth(req.body,function(err,result){
        if (err) {
            console.error(err);
        } else {
            //setTimeout(function(){
                res.json(result);
            //},5000);
        }
    });
});

//根据token获取用户信息
router.get('/', function(req, res) {
    users.getUserInfoByToken(req.query,function(err,result){
        if (err) {
            console.error(err);
        } else {
            //setTimeout(function(){
                res.json(result);
            //},2000);
        }
    });
});

//清除auth_token
router.post('/delete', function(req, res) {
    users.deleteToken(req.body,function(err,result){
        if (err) {
            console.error(err);
        } else {
            res.json(result);
        }
    });
});


module.exports = router;

