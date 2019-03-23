var mongoose = require('mongoose');
var webpush = require('web-push');

var Card = mongoose.model('Cards'),
    EntryHistory = mongoose.model('EntryHistorys'),
    HomeConfiguration = mongoose.model('HomeConfigurations');

let userSubscriptions = [];

exports.subscribeNotification = (req, res) => {
    const sub = req.body;
    userSubscriptions.push(sub);
    res.status(200).json({ message: 'Subscription added successfully.' });
};

exports.sendNotification = (req, res) => {
    const vapidKeys = {
        publicKey: 'BBChwbDE1N8AcV5R1FftCBxhleb9x8HvkBhSoa3Ze7UlA2WwqrkonE9gPLgX-RMJD5fpBql59jqV_2wFOnat9bo',
        privateKey: 'ogIHd0TIbzbbwleXHwOsx4Y5bX4Imz5wa7nYdq1lXUA',
    };

    webpush.setVapidDetails('mailto:fodor.lori@hotmail.com', vapidKeys.publicKey, vapidKeys.privateKey);

    const notificationPayload = {
        notification: {
            title: 'Angular News',
            body: 'Newsletter Available!',
            icon: 'assets/main-page-logo-small-hat.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1,
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Go to the site',
                },
            ],
        },
    };

    Promise.all(
        userSubscriptions.map((sub) => webpush.sendNotification(sub, JSON.stringify(notificationPayload)))
    )
        .then(() => res.status(200).json({ message: 'This is a notification.' }))
        .catch((err) => {
            console.error('Error sending notification, reason: ', err);
            res.sendStatus(500);
        });

    res.status(200).json({ message: 'Messages sent successfully.' });
};

exports.getConfig = (req, res) => {};
