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

var EntryHistorySchema = new mongoose.Schema({
    card_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    event: {
        type: String,
        required: true,
        enum: ['in', 'out'],
    },
    owner_name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('Cards', CardSchema);
module.exports = mongoose.model('EntryHistorys', EntryHistorySchema);
