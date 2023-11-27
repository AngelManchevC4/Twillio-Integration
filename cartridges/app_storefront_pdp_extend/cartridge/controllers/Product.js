'use strict';

/**
 * @namespace Product
 */

var server = require('server');

var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

var base = server.extend(module.superModule);


server.post('Subscribe', server.middleware.https, csrfProtection.validateAjaxRequest, function (req, res, next) {
    var notificationHelper = require('*/cartridge/scripts/helpers/notificationHelpers.js');

    var Transaction = require('dw/system/Transaction');

    var type = "PRODUCT_SUBSCRIBE_NOTIFICATION";

    var subscriptionForm = server.forms.getForm('subscription');

    if (subscriptionForm.valid) {
        Transaction.wrap(function () {
            notificationHelper.addSubscriptionEntry(type,
                subscriptionForm.customer.productsubscribeid.value,
                subscriptionForm.customer.phonenumber.value,
                subscriptionForm.customer.productsubscribename.value)
        })
    }

    res.json({
        message: "Success"
    });

    return next();

})

module.exports = server.exports();
