var models = require('./_models');

var users = new models(
    'users',
    {
        name: "",
        password: "",
        sex: 0,
        birthday: '',
        email: '',
        status: 1
    }
);

module.exports = users;
