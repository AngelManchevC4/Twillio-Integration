'use strict';

function getClientContentAsset(contentAssetID) {
    var ContentMgr = require('dw/content/ContentMgr');
    var customerContent = ContentMgr.getContent(contentAssetID);
    if (customerContent && customerContent.online) {
        return customerContent;
    } else {
        return null;
    }
}

module.exports = {
    getClientContentAsset: getClientContentAsset
}
