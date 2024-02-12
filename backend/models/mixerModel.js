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
    return mixer;
}

// userSchema.statics.addContributors = async function(userID, accessToken, refreshToken){
    
//     //find
//     const user = await this.findOne({'userID': userID});
//     //update locally
//     user.accessToken = accessToken;
//     user.refreshToken = refreshToken;
//     //save updates to db
//     await user.save();
//     return user;
// }

module.exports = mongoose.model('Mixer', mixerSchema);