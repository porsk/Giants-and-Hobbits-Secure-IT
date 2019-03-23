var mongoose = require('mongoose');

var CardSchema = new mongoose.Schema({
    card_key: {
        type: String,
        required: true,
    },
    owner_name: {
        type: String,
        required: true,
    },
    last_usage: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        required: true,
        default: 'inactive',
        enum: ['active', 'inactive'],
    },
});

module.exports = mongoose.model('Cards', CardSchema);
