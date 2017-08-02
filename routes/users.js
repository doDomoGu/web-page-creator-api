var express = require('express');
var router = express.Router();
var users = require('../models/users');

//获取全部
router.get('/', function(req, res) {
    users.list(function(err, data){
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

module.exports = router;
