var express = require('express');
var router = express.Router();
var users = require('../models/users');


//获取全部
router.get('/', function(req, res) {
    users.list(function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header('Access-Control-Allow-Headers', 'Content-Type');
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

