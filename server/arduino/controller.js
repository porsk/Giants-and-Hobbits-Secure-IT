var mongoose = require('mongoose');

var Card = mongoose.model('Cards'),
    EntryHistory = mongoose.model('EntryHistorys'),
    HomeConfiguration = mongoose.model('HomeConfigurations'),
    EventHistory = mongoose.model('EventHistorys');

exports.validateCard = (card_key) => {
    return Card.find({ card_key }, (err, card) => {
        if (err) {
            return [];
        } else {
            return card;
        }
    });
};

exports.updateCard = (_id, status) => {
    Card.findByIdAndUpdate(
        _id,
        {
            last_usage: Date.now(),
            status,
        },
        (err, card) => {
            if (err) {
                console.log(err);
            } else {
                addToEntryHistory(_id, card.owner_name, status === 'active' ? 'in' : 'out');
                updateHomeStatus(status === 'active' ? 'unlocked' : 'locked');
            }
        }
    );
};

function addToEntryHistory(card_id, owner_name, event) {
    let entry = new EntryHistory({
        card_id,
        event,
        owner_name,
        date: Date.now(),
    });

    entry.save((err, entry) => {
        if (err) {
            console.log(err);
        } else {
            console.log('New entry event: ' + entry.owner_name + ' - ' + entry.event);
        }
    });
}

function updateHomeStatus(status) {
    HomeConfiguration.findOneAndUpdate({}, { status }, (e, d) => {
        if (e) {
            console.log(e);
        }
    });
}

exports.activateMotionAlert = () => {
    HomeConfiguration.findOneAndUpdate({}, { motionAlert: true }, (e, d) => {
        if (e) {
            console.log(e);
        }
    });
    addToEventHistory('motion', 'on');
};

exports.activateFlameAlert = () => {
    HomeConfiguration.findOneAndUpdate({}, { flameAlert: true }, (e, d) => {
        if (e) {
            console.log(e);
        }
    });
    addToEventHistory('flame', 'on');
};

exports.activateMethaneAlert = () => {
    HomeConfiguration.findOneAndUpdate({}, { methaneAlert: true }, (e, d) => {
        if (e) {
            console.log(e);
        }
    });
    addToEventHistory('methane', 'on');
};

exports.getHomeStatus = () => {
    return HomeConfiguration.find({}, (err, config) => {
        if (err) {
            console.log(err);
        } else {
            return config;
        }
    });
};

function addToEventHistory(eventType, action) {
    let event = new EventHistory({
        eventType,
        action,
        date: Date.now(),
    });

    event.save((err, event) => {
        if (err) {
            console.log(err);
        } else {
            console.log(event);
        }
    });
}

////////////////Utils
exports.addCard = (data) => {
    var card = new Card(data);

    card.save((err, card) => {
        if (err) {
            console.log(err);
        } else {
            console.log(card);
        }
    });
};

exports.addHomeConfiguration = () => {
    var config = new HomeConfiguration({
        status: 'locked',
        motionSensor: true,
        flameSensor: true,
        imHomeSimulation: true,
        methaneSensor: true,
        motionAlert: false,
        flameAlert: false,
        methaneAlert: false,
    });

    config.save((err, config) => {
        if (err) {
            console.log(err);
        } else {
            console.log(config);
        }
    });
};
