const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mixerSchema = new Schema({
    'playlistName': {
        'type': String,
        'required': true,
    },
    'playlistID': {
        'type': String,
        'required': true,
    },
    'ownerUserName': {
        'type': String,
        'required': true,
    },
    'ownerUserID': {
        'type': String,
        'required': true,
    },
    'contributors': {
        'type': Array,
        'required': true,
    },
    'options': {
        'type': Object,
        'required': true,
    },
    'constituentPlaylists': {
        'type': Array,
        'required': true,
    },
}, {'timestamps': true});

module.exports = mongoose.model('Mixer', mixerSchema);