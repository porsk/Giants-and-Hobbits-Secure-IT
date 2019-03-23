var mongoose = require('mongoose');

var Card = mongoose.model('Cards');

exports.validateCard = (card_key) => {
    return Card.find({ card_key }, (err, card) => {
        if (err) {
            return [];
        } else {
            return card;
        }
    });
};

exports.updateCard = (id, last_usage, status) => {
    Card.findByIdAndUpdate(
        id,
        {
            last_usage,
            status,
        },
        (err, card) => {
            if (err) {
                console.log(err);
            } else {
                console.log(card);
            }
        }
    );
};

////////////////Utils
exports.addCard = (data) => {
    var card = new Card(data);

    card.save((err, card) => {
        if (err) {
            console.log(error);
        } else {
            console.log(card);
        }
    });
};
