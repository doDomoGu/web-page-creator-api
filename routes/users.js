var express = require('express');
var router = express.Router();
var users = require('../models/users').users;

/*module.exports.list = function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.send(users);
};

module.exports.get = function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.send(users[req.param('id')]);
};*/


/*module.exports.delete = function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    delete users[req.param('id')];
    res.send({status:"success", message:"delete user success"});
    console.log(users);
};


module.exports.update = function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    users[req.body.id] = req.body;
    res.send({status:"success", message:"update user success"});
    console.log(users);
};


module.exports.add = function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    console.log(req.body);
    users[req.body.id] = req.body;
    res.send({status:"success", message:"add user success"});
    console.log(users);
};*/



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id', function(req, res, next) {

    //res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.send(users[req.param('id')]);
    //res.send('respond with a resource');
});

module.exports = router;
