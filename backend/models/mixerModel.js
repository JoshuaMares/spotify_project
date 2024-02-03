const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mixerSchema = new Schema({
    'playlistName': {//dont need as we pull live
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
    'options': {//dont need
        'type': Object,
        'required': true,
    },
    'constituentPlaylists': {//just add as we go
        'type': Array,
        'required': true,
    },
}, {'timestamps': true});

module.exports = mongoose.model('Mixer', mixerSchema);