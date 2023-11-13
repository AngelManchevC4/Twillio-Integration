var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var CSVStreamWriter = require('dw/io/CSVStreamWriter');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');
var ProductMgr = require('dw/catalog/ProductMgr');
var ProductInventoryMgr = require('dw/catalog/ProductInventoryMgr');
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
            var productATSQuantity = ProductInventoryMgr.getInventoryList("inventory_m").getRecord(customersProductID).ATS.value;

            if (productATSQuantity > 0) {
                customersPhones.forEach(element => {
                    twilioSendSms.twilioSendSms().call({ To: element, From: "+15168064395", Body: `Product : ${customersProductName} with ID: ${customersProductID} is back in stock !!!` });
                    Transaction.wrap(function () {
                        CustomObjectMgr.remove(notificationObj);
                    })
                });

            } else {
                customersPhones.forEach(element => {
                    twilioSendSms.twilioSendSms().call({
                        To: element, From: "+15168064395", Body: `Product isn't restocked yet. You will be contacted when restocked !`
                    });
                });
            }

        }

    } catch (e) {
        var logger = Logger.getLogger("error.notification.job");
        logger.error("notification Job Error", "error");
    }
}