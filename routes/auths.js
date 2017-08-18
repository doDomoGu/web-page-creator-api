var express = require('express');
var router = express.Router();
var users = require('../models/users');


//验证登录
router.post('/', function(req, res) {
    users.auth(req.body,function(err,result){
        if (err) {
            console.error(err);
        } else {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header('Access-Control-Allow-Headers', 'Content-Type');


            res.json(result);
        }
    });
});

//根据token获取用户信息
router.get('/', function(req, res) {
    users.getUserInfoByToken(req.query,function(err,result){
        if (err) {
            console.error(err);
        } else {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header('Access-Control-Allow-Headers', 'Content-Type');


            res.json(result);
        }
    });
});


module.exports = router;

