var models = require('./_models');

var websites = new models(
    'website',
    {
        id: 0,
        alias: "",
        name: "",
        user_id: 0,
        status: 1
    },
    []
);

module.exports = websites;




