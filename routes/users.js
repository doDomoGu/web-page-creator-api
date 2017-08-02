var express = require('express');
var router = express.Router();
var users = require('../models/users');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', function(req, res) {
    users.add(req.body,function(err, data){
        if (err) {
            console.error(err);
        } else {
            res.json(data);
        }
    });
});



//获取
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
