var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var CSVStreamWriter = require('dw/io/CSVStreamWriter');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');


var twilioSendSms = require("~/cartridge/scripts/services/twilioSendSms")

module.exports.execute = function () {
    var notificationObjIterator = CustomObjectMgr.getAllCustomObjects('Product-Subscribe-Notification');

    // twilioSendSms.twilioSendSms().call({ To: "+359884676766", From: "+15168064395", Body: "hihi" });

    // var file;
    // var fileWrite;
    // var csv;

    var customersProductID;
    var customersPhone;
    var customersProductName;
    try {
        // file = new File([File.IMPEX, "notification", "notification.csv"].join(File.SEPARATOR));
        // fileWrite = new FileWriter(file);

        // csv = new CSVStreamWriter(fileWrite);
        // csv.writeNext(["phone", "creatdate", "customerobj"]);
        // csv.writeNext(["---", "---", "---", "---"]);



        while (notificationObjIterator.hasNext()) {
            var customers = notificationObjIterator.next();
            customersPhone = customers.custom.clientNumber.split('&');
            customersProductName = customers.custom.productName.split('&');
            customersProductID = customers.custom.productID
            // customersPhone.forEach(element => {
            //     twilioSendSms.twilioSendSms().call({ To: element, From: "+15168064395", Body: `Product : ${customersProductName.element} with ID: ${customersProductID.element} is back in stock !!!`});
            // });
        }

        for (var i = 0; i < customersPhone.length-2; i++) {
            twilioSendSms.twilioSendSms().call({ To: customersPhone[i], From: "+15168064395", Body: `Product : ${customersProductName[i]} with ID: ${customersProductID} is back in stock !!!` });
        }

    } catch (e) {
        var logger = Logger.getLogger("error.notification.job");
        logger.error("notification Job Error", e);
    }
}