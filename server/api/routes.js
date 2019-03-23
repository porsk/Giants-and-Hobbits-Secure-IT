var express = require('express');
var controller = require('./controllers');
var router = express.Router();

router.route('/notification').post(controller.subscribeNotification);

router.route('/send').post(controller.sendNotification);

module.exports = router;
