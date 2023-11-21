'use strict';

function getCustomObject(customObjectType, primaryKey) {
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');

    return CustomObjectMgr.getCustomObject(customObjectType, primaryKey);
}

function createCustomObject(customObjectType, primaryKey) {
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');

    return CustomObjectMgr.createCustomObject(customObjectType, primaryKey);
}

module.exports={
    getCustomObject:getCustomObject,
    createCustomObject:createCustomObject
}