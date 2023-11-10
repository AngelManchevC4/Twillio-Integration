var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var CSVStreamWriter = require('dw/io/CSVStreamWriter');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');


var twilioSendSms = require("~/cartridge/scripts/services/twilioSendSms")

module.exports.execute = function () {
    var notificationObjIterator = CustomObjectMgr.getAllCustomObjects('Product-Subscribe-Notification');

    twilioSendSms.twilioSendSms().call({ To: "+359884676766",From:"+15168064395", Body: "hihi" });

    var file;
    var fileWrite;
    var csv;

    try {
        file = new File([File.IMPEX, "notification", "notification.csv"].join(File.SEPARATOR));
        fileWrite = new FileWriter(file);

        csv = new CSVStreamWriter(fileWrite);
        csv.writeNext(["phone", "creatdate", "customerobj"]);
        csv.writeNext(["---", "---", "---", "---"]);



        while (notificationObjIterator.hasNext()) {
            var notification = notificationObjIterator.next();
            csv.writeNext([notification.custom.phoneNumber, notification.custom.creationDate, notification.custom.customerObj]);

            // Transaction.wrap(function () {
            //     CustomObjectMgr.remove(notification);
            // })
        }

    } catch (e) {
        var logger = Logger.getLogger("error.notification.job");
        logger.error("notification Job Error", e);
    } finally {
        csv.close();
        fileWrite.close();
    }
}