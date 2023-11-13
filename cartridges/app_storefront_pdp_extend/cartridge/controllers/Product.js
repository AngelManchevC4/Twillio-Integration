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
server.replace('Show', server.middleware.https, csrfProtection.generateToken, cache.applyPromotionSensitiveCache, consentTracking.consent, function (req, res, next) {
    var ContentMgr = require('dw/content/ContentMgr');
    var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
    var showProductPageHelperResult = productHelper.showProductPage(req.querystring, req.pageMetaData);
    var productType = showProductPageHelperResult.product.productType;

    var customerPhone;

    req.currentCustomer.profile ? customerPhone = req.currentCustomer.profile.phone : null;

    var subscriptionForm = server.forms.getForm('subscription');
    subscriptionForm.clear();

    var customerContent = ContentMgr.getContent("QuantityNotificationMsg");

    if (!showProductPageHelperResult.product.online && productType !== 'set' && productType !== 'bundle') {
        res.setStatusCode(404);
        res.render('error/notFound');
    } else {
        var pageLookupResult = productHelper.getPageDesignerProductPage(showProductPageHelperResult.product);

        if ((pageLookupResult.page && pageLookupResult.page.hasVisibilityRules()) || pageLookupResult.invisiblePage) {
            // the result may be different for another user, do not cache on this level
            // the page itself is a remote include and can still be cached
            res.cachePeriod = 0; // eslint-disable-line no-param-reassign
        }
        if (pageLookupResult.page) {
            res.page(pageLookupResult.page.ID, {}, pageLookupResult.aspectAttributes);
        } else {
            res.render(showProductPageHelperResult.template, {
                product: showProductPageHelperResult.product,
                addToCartUrl: showProductPageHelperResult.addToCartUrl,
                resources: showProductPageHelperResult.resources,
                breadcrumbs: showProductPageHelperResult.breadcrumbs,
                canonicalUrl: showProductPageHelperResult.canonicalUrl,
                schemaData: showProductPageHelperResult.schemaData,
                content: customerContent,
                subscriptionForm: subscriptionForm,
                customerPhone: customerPhone
            });
        }
    }
    next();
}, pageMetaData.computedPageMetaData);

server.post('Subscribe', server.middleware.https, csrfProtection.validateAjaxRequest, function (req, res, next) {

    var Transaction = require('dw/system/Transaction');
    var CustomerMgr = require('dw/customer/CustomerMgr');
    var Resource = require('dw/web/Resource');
    var URLUtils = require('dw/web/URLUtils');
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');

    var type = "Product-Subscribe-Notification";

    var subscriptionForm = server.forms.getForm('subscription');

    if (subscriptionForm.valid) {
        Transaction.wrap(function () {
            var subscriptionEntry = CustomObjectMgr.getCustomObject(type, subscriptionForm.customer.productsubscribeid.value);
            if (subscriptionEntry) {
                var subsArray = subscriptionEntry.custom.phoneNumbers;
                let phoneNumbersArray = [];
                for (let i = 0; i < subsArray.length; i++) {
                    phoneNumbersArray.push(subsArray[i]);
                }
                phoneNumbersArray.push(subscriptionForm.customer.phonenumber.value);
                subscriptionEntry.custom.phoneNumbers = phoneNumbersArray
            } else {
                subscriptionEntry = CustomObjectMgr.createCustomObject(type, subscriptionForm.customer.productsubscribeid.value);
                subscriptionEntry.custom.phoneNumbers = new Array(subscriptionForm.customer.phonenumber.value);
                subscriptionEntry.custom.productName = subscriptionForm.customer.productsubscribename.value
            }

        })
    }

    res.redirect("Home-Show");

    return next();

})

module.exports = server.exports();
