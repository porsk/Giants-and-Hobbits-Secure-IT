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

var HomeConfigurationSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        default: 'locked',
        enum: ['locked', 'unlocked'],
    },
    motionSensor: {
        type: Boolean,
        required: true,
        default: true,
    },
    motionAlert: {
        type: Boolean,
        required: true,
        default: false,
    },
    flameSensor: {
        type: Boolean,
        required: true,
        default: true,
    },
    flameAlert: {
        type: Boolean,
        required: true,
        default: false,
    },
    imHomeSimulation: {
        type: Boolean,
        required: true,
        default: true,
    },
    methaneSensor: {
        type: Boolean,
        required: true,
        default: true,
    },
    methaneAlert: {
        type: Boolean,
        required: true,
        default: false,
    },
});

module.exports = mongoose.model('Cards', CardSchema);
module.exports = mongoose.model('EntryHistorys', EntryHistorySchema);
module.exports = mongoose.model('HomeConfigurations', HomeConfigurationSchema);
