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

/**
 * @typedef ProductDetailPageResourceMap
 * @type Object
 * @property {String} global_availability - Localized string for "Availability"
 * @property {String} label_instock - Localized string for "In Stock"
 * @property {String} global_availability - Localized string for "This item is currently not
 *     available"
 * @property {String} info_selectforstock - Localized string for "Select Styles for Availability"
 */

/**
* Product-Show : This endpoint is called to show the details of the selected product
* @name Base/Product-Show
* @function
* @memberof Product
* @param {middleware} - cache.applyPromotionSensitiveCache
* @param {middleware} - consentTracking.consent
* @param {querystringparameter} - pid - Product ID
* @param {category} - non-sensitive
* @param {renders} - isml
* @param {serverfunction} - get
*/

server.append('Show', server.middleware.https, csrfProtection.generateToken, function (req, res, next) {
    var notificationHelper = require('*/cartridge/scripts/helpers/notificationHelpers.js');

    var productHelper = require('*/cartridge/scripts/helpers/productHelpers');

    var showProductPageHelperResult = productHelper.showProductPage(req.querystring, req.pageMetaData);

    var customerPhone;

    req.currentCustomer.profile ? customerPhone = req.currentCustomer.profile.phone : null;

    var subscriptionForm = server.forms.getForm('subscription');
    subscriptionForm.clear();

    var customerContent = notificationHelper.getClientContentAsset("asset-ClientSubscriptionFormMessage");

    res.render(showProductPageHelperResult.template, {
        customerContent: customerContent,
        subscriptionForm: subscriptionForm,
        customerPhone: customerPhone,
    })

    next();
});

server.post('Subscribe', server.middleware.https, csrfProtection.validateAjaxRequest, function (req, res, next) {
    var notificationHelper = require('*/cartridge/scripts/helpers/notificationHelpers.js');

    var Transaction = require('dw/system/Transaction');

    var type = "Product-Subscribe-Notification";

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
