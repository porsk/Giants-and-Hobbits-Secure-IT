var mongoose = require('mongoose');
var webpush = require('web-push');

var Card = mongoose.model('Cards'),
    EntryHistory = mongoose.model('EntryHistorys'),
    HomeConfiguration = mongoose.model('HomeConfigurations'),
    EventHistory = mongoose.model('EventHistorys');

let userSubscriptions = [];
const vapidKeys = {
    publicKey: 'BBChwbDE1N8AcV5R1FftCBxhleb9x8HvkBhSoa3Ze7UlA2WwqrkonE9gPLgX-RMJD5fpBql59jqV_2wFOnat9bo',
    privateKey: 'ogIHd0TIbzbbwleXHwOsx4Y5bX4Imz5wa7nYdq1lXUA',
};

webpush.setVapidDetails('mailto:fodor.lori@hotmail.com', vapidKeys.publicKey, vapidKeys.privateKey);

exports.subscribeNotification = (req, res) => {
    const sub = req.body;

    if (
        !userSubscriptions.find((element) => {
            return element.keys.p256dh == sub.keys.p256dh;
        })
    ) {
        console.log('User subscribed to notifications!');
        userSubscriptions.push(sub);
    }

    res.status(200).json({ message: 'Subscription added successfully.' });
};

exports.sendNotification = (title, message, data) => {
    const notificationPayload = {
        notification: {
            title: title,
            body: message,
            icon: 'assets/main-page-logo-small-hat.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1,
                data,
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
        .then((d) => {
            //console.log(d);
        })
        .catch((err) => {
            console.log('Notification sending error: ' + err.message);
        });
};

exports.getConfig = (req, res) => {
    HomeConfiguration.find({}, (err, config) => {
        if (err) {
            res.status(500).json({ message: 'Something went wrong on our side.' });
        } else {
            res.status(200).json(config[0]);
        }
    });
};

exports.updateConfig = (req, res) => {
    HomeConfiguration.findOneAndUpdate({}, { $set: req.body }, (err, config) => {
        if (err) {
            res.status(500).json({ message: 'Something went wrong on our side.' });
        } else {
            res.status(200).json({ message: 'Config successfully updated.' });
        }
    });
};

exports.getEntries = (req, res) => {
    if (req.query.last != null) {
        //Return only the last entry
        EntryHistory.findOne({}, {}, { sort: { date: -1 } }, (err, entry) => {
            if (err) {
                res.status(500).json({ message: 'Something went wrong on our side.' });
            } else {
                res.status(200).json({ name: entry.owner_name, date: entry.date });
            }
        });
    } else if (req.query.all != null) {
        //Return all entry log
        EntryHistory.find({}, {}, { sort: { date: -1 } }, (err, entries) => {
            if (err) {
                res.status(500).json({ message: 'Something went wrong on our side.' });
            } else {
                res.status(200).json(entries);
            }
        });
    }
};

exports.getEvents = (req, res) => {
    EventHistory.find({}, {}, { sort: { date: -1 } }, (err, events) => {
        if (err) {
            res.status(500).json({ message: 'Something went wrong on our side.' });
        } else {
            res.status(200).json(events);
        }
    });
};

/*exports.turnOffAlert = (req, res) => {
    if (req.query.eventType != null && ['motion', 'flame', 'methane'].includes(req.query.eventType)) {
        
    } else {
        req.status(400).json({ message: 'Wrong or missing query parameter.' });
    }
};*/
