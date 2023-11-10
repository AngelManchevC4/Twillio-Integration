"use strict";

function twilioSendSms() {
    var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

    var twilioData = LocalServiceRegistry.createService("http.twilio.sms.notification", {
        createRequest: function (svc, args) {
            svc.addHeader('Content-Type', 'application/x-www-form-urlencoded');
            svc.setRequestMethod("POST");
            return `To=${args.To}&From=${args.From}&Body=${args.Body}`;
        },
        parseResponse: function (svc, client) {
            return client.text
        },

        filterLogMessage: function (msg) {
            let message = msg.replace(/"cost_in_credits":"\d+"/, '"cost_in_credits":"$$$$$$$$$$$$$$$$$$$$$$$$$$$$"');
            return message;
        },
    })

    return twilioData;
}
module.exports = {
    twilioSendSms: twilioSendSms,
}