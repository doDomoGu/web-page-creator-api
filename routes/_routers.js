var express = require('express');
var router = express.Router();
router.models = require('../models/_models');

//获取全部
router.get('/', function(req, res) {
    router.models.list(function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});

//新增
router.post('/', function(req, res) {
    router.models.add(req.body,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});

//更新(修改)
router.patch('/:id', function(req, res) {
    router.models.update(req.params.id,req.body,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});

//获取单条
router.get('/:id', function(req, res) {
    router.models.get(req.params.id,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});

//删除单条 （逻辑删除）
router.delete('/:id', function(req, res) {
    router.models.delete(req.params.id,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});




module.exports = router;
