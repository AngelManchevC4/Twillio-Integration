'use strict';

var Resource = require('dw/web/Resource');

module.exports = function (object, availabilityModel) {
    Object.defineProperty(object, 'availabilityModel', {
        enumerable: true,
        writable:true,
        value: availabilityModel
    });
};
