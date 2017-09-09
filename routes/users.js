var express = require('express');
var router = express.Router();

var users = require('../models/users');
var qs = require('qs');

//根据多个用户ID (存在query信息中) 获取用户组信息
router.post('/:id/usergroups', function(req, res) {
    users.setUsergroups(req.params.id,qs.parse(req.body.data),function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});


//根据多个用户ID (存在query信息中) 获取用户组信息
router.get('/usergroups', function(req, res) {
    users.getUsergroupsSet(req.query,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});



//根据单个用户ID 获取用户组信息
router.get('/:id/usergroups', function(req, res) {
    users.getUsergroups(req.params.id,req.query,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});

//获取全部
router.get('/', function(req, res) {
    users.list(req.query,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});

//新增
router.post('/', function(req, res) {
    users.add(req.body,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});

//更新(修改)
router.patch('/:id', function(req, res) {
    users.update(req.params.id,req.body,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});

//获取单条
router.get('/:id', function(req, res) {
    users.get(req.params.id,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});

//删除单条 （逻辑删除）
router.delete('/:id', function(req, res) {
    users.delete(req.params.id,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});





module.exports = router;

