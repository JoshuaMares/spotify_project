const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mixerSchema = new Schema({
    'playlistID': {
        'type': String,
        'required': true,
        'unique': true,
    },
    'ownerUserID': {
        'type': String,
        'required': true,
    },
    'contributors': {
        'type': Array,
        'required': true,
    },
    'playlistURL': {
        'type': String,
        'required': true,
    },
}, {'timestamps': true});

mixerSchema.statics.createMixer = async function (playlistID, ownerUserID, contributors, playlistURL){
    if( !playlistID || !ownerUserID || !contributors || !playlistURL){
        throw Error('All fields must be filled');
    }
    
    const exists = await this.findOne({'playlistID': playlistID});
    if(exists){
        throw Error('Playlist is already a mixer');
    }

    const mixer = await this.create({
        'playlistID': playlistID,
        'ownerUserID': ownerUserID,
        'contributors': contributors,
        'playlistURL': playlistURL,
    });

    if(!mixer){
        throw Error('Mixer could not be created');
    }

    return mixer;
}

mixerSchema.statics.info = async function(playlistID){
    if(!playlistID){
        throw Error('No playlistID provided');
    }
    const mixer = await this.findOne({'playlistID': playlistID});
    if(!mixer){
        throw Error(`Mixer does not exist with playlistID: ${playlistID}`);
    }
    return mixer;
}

mixerSchema.statics.addContributors = async function(playlistID, contributors){
    if(!playlistID || !contributors){
        throw Error('All fields must be filled');
    }

    const mixer = await this.findOne({playlistID});
    let temp = mixer.contributors.concat(contributors);
    temp = [...new Set(temp)];
    mixer.contributors = temp;
    await mixer.save();
    return mixer;
}

module.exports = mongoose.model('Mixer', mixerSchema);