var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var CSVStreamWriter = require('dw/io/CSVStreamWriter');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');
var ProductMgr = require('dw/catalog/ProductMgr');
var Resource = require('dw/web/Resource');
var SitePreferences = require('dw/system/SitePreferences');
var Site = require('dw/system/Site');
var twilioSendSms = require("~/cartridge/scripts/services/twilioSendSms")

module.exports.execute = function () {
    var notificationObjIterator = CustomObjectMgr.getAllCustomObjects('Product-Subscribe-Notification');

    var customersProductID;
    var customersProductName;
    var customersPhones;

    try {

        while (notificationObjIterator.hasNext()) {

            var notificationObj = notificationObjIterator.next();

            customersPhones = notificationObj.custom.phoneNumbers;
            customersProductID = notificationObj.custom.productID;
            customersProductName = notificationObj.custom.productName;

            var product = ProductMgr.getProduct(customersProductID);
            var isProductOrderable = product.availabilityModel.inStock;

            let isServiceSuccess

            if (isProductOrderable) {
                customersPhones.forEach(element => {
                    let smsSenderPhoneNumber = Site.getCurrent().getCustomPreferenceValue('SmsPhoneNumberSenderForTwilio');
                    isServiceSuccess = twilioSendSms.twilioSendSms().call({ To: element, From: smsSenderPhoneNumber, Body: Resource.msgf('twillio.service.instock.body.label', 'jobs', null, [customersProductName, customersProductID]) }).isOk();
                });

            } else {
                customersPhones.forEach(element => {
                    twilioSendSms.twilioSendSms().call({
                        To: element, From: smsSenderPhoneNumber, Body: Resource.msg('twillio.service.outofstock.body.label', 'jobs', null)
                    });
                });
            }

            if (isServiceSuccess) {
                Transaction.wrap(function () {
                    CustomObjectMgr.remove(notificationObj);
                })
            } else {
                let error = new Error("Service call failed");
                return error;
            }

        }

    } catch (e) {
        var logger = Logger.getLogger("error.notification.job");
        logger.error("notification Job Error", "error");
    }
}