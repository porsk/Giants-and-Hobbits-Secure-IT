var express = require('express');
var controller = require('./controllers');
var router = express.Router();

router.route('/notification').post(controller.subscribeNotification);

router.route('/send').post(controller.sendNotification);

router
    .route('/config')
    .get(controller.getConfig)
    .put(controller.updateConfig);

router.route('/entries/logs').get(controller.getEntries);

module.exports = router;
