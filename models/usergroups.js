var models = require('./_models');


var usergroups = new models(
    'users',
    {
        id: 0,
        name:"",
        alias: "",
        status: 0,
    }
);

module.exports = usergroups;
