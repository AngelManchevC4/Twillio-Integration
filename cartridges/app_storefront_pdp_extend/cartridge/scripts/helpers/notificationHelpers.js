'use strict';

function getClientContentAsset(contentAssetID) {
    var ContentMgr = require('dw/content/ContentMgr');
    var customerContent = ContentMgr.getContent(contentAssetID);
    return customerContent;
}

function getCustomObject(customObjectType, primaryKey) {
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');

    return CustomObjectMgr.getCustomObject(customObjectType, primaryKey);
}

function createCustomObject(customObjectType, primaryKey) {
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');

    return CustomObjectMgr.createCustomObject(customObjectType, primaryKey);
}

function addSubscriptionEntry(type, primaryKey, phoneNumber, productName) {

    var subscriptionEntry = getCustomObject(type, primaryKey);

    if (subscriptionEntry) {
        var subsArray = subscriptionEntry.custom.phoneNumbers;
        let phoneNumbersArray = [];
        for (let i = 0; i < subsArray.length; i++) {
            phoneNumbersArray.push(subsArray[i]);
        }
        phoneNumbersArray.push(phoneNumber);
        subscriptionEntry.custom.phoneNumbers = phoneNumbersArray
    } else {
        subscriptionEntry = createCustomObject(type, primaryKey);
        subscriptionEntry.custom.phoneNumbers = new Array(phoneNumber);
        subscriptionEntry.custom.productName = productName
    }

    return subscriptionEntry;

}

module.exports = {
    addSubscriptionEntry: addSubscriptionEntry,
    getClientContentAsset: getClientContentAsset
}
