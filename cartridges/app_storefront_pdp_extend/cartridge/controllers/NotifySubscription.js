'use strict';

/**
 * @namespace NotifySubscription
 */


var server = require('server');

var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
/**
 * Any customization on this endpoint, also requires update for Default-Start endpoint
 */
/**
 * NotifySubscription-Show : This endpoint is called when a shopper navigates to the home page
 * @name Base/NotifySubscription-Show
 * @function
 * @memberof NotifySubscription
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - cache.applyDefaultCache
 * @param {category} - non-sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get('Show', server.middleware.https, csrfProtection.generateToken, function (req, res, next) {

    var product = req.querystring;
    
    var notificationHelper = require('*/cartridge/scripts/helpers/notificationHelpers.js');

    var customerPhone;

    req.currentCustomer.profile ? customerPhone = req.currentCustomer.profile.phone : null;

    var subscriptionForm = server.forms.getForm('subscription');
    subscriptionForm.clear();

    var customerContent = notificationHelper.getClientContentAsset("asset-ClientSubscriptionFormMessage");

    res.render("product/components/notifySubscription", {
        customerContent: customerContent,
        subscriptionForm: subscriptionForm,
        customerPhone: customerPhone,
        product:product
    })

    next();
});

module.exports = server.exports();
