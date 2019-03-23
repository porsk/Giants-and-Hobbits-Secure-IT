var mongoose = require('mongoose');

var Card = mongoose.model('Cards');
var EntryHistory = mongoose.model('EntryHistorys');

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
            console.log(entry);
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
