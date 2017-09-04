var express = require('express');
var router = express.Router();

var usergroups = require('../models/usergroups');

//根据用户组ID 设置用户组下的用户
router.post('/:id/users', function(req, res) {
    usergroups.setUser(req.params.id,req.body,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});

//根据用户组ID 获取用户组下的用户
router.get('/:id/users', function(req, res) {
    usergroups.getUser(req.params.id,req.query,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});


//获取全部
router.get('/', function(req, res) {
    usergroups.list(req.query,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});

//新增
router.post('/', function(req, res) {
    usergroups.add(req.body,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});

//更新(修改)
router.patch('/:id', function(req, res) {
    usergroups.update(req.params.id,req.body,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});

//获取单条
router.get('/:id', function(req, res) {
    usergroups.get(req.params.id,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});

//删除单条 （逻辑删除）
router.delete('/:id', function(req, res) {
    usergroups.delete(req.params.id,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});


module.exports = router;

