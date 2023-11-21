'use strict';

var customObjectHelper = require('*/cartridge/scripts/helpers/customObjectHelpers.js');

function addSubscriptionEntry(type, primaryKey, phoneNumber, productName) {

    var subscriptionEntry = customObjectHelper.getCustomObject(type, primaryKey);

    if (subscriptionEntry) {
        var subsArray = subscriptionEntry.custom.phoneNumbers;
        let phoneNumbersArray = [];
        for (let i = 0; i < subsArray.length; i++) {
            phoneNumbersArray.push(subsArray[i]);
        }
        phoneNumbersArray.push(phoneNumber);
        subscriptionEntry.custom.phoneNumbers = phoneNumbersArray
    } else {
        subscriptionEntry = customObjectHelper.createCustomObject(type, primaryKey);
        subscriptionEntry.custom.phoneNumbers = new Array(phoneNumber);
        subscriptionEntry.custom.productName = productName
    }

    return subscriptionEntry;
}

module.exports = {
    addSubscriptionEntry: addSubscriptionEntry,
}
