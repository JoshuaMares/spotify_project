const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const authCodechema = new Schema({
    'authCode': {
        'type': String,
        'required': true,
        'unique': true,
    },
}, {'timestamps': true});

//static signup method
authCodeSchema.statics.registerCode = async function(code){
    if(!code){
        throw Error('No Code')
    }

    const exists = await this.findOne({'authCode': code});
    if(exists){
        throw Error('Used Code');
    }

    const authCode = await this.create({
        'authCode': code,
    });

    return;
}


module.exports = mongoose.model('AuthCode', authCodeSchema);