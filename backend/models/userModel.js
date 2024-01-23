const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    'userName': {
        'type': String,
        'required': true,
    },
    'userID': {
        'type': String,
        'required': true,
        'unique': true,
    },
    'accessToken': {
        'type': String,
        'required': true,
    },
    'refreshToken': {
        'type': String,
        'required': true,
    },
    'mixers': [{
        'type': mongoose.Types.ObjectId,
        'ref': 'Mixer',
        'required': true,
    }],
}, {'timestamps': true});

//static signup method
userSchema.statics.createUser = async function(userName, userID, accessToken, refreshToken){
    if( !userName || !userID || !accessToken || !refreshToken ){
        throw Error('All fields must be filled');
    }

    //use this rather find one as we dont have user yet
    const exists = await this.findOne({'userID': userID});
    if(exists){
        throw Error('User already exists');
    }

    //genSalt arg is round which is how many times we hash
    //more times means it takes longer but is also more secure
    //const salt = await bcrypt.genSalt(10);
    //const hash = await bcrypt.hash(password, salt);

    const user = await this.create({
        'userName': userName,
        'userID': userID,
        'accessToken': accessToken,
        'refreshToken': refreshToken,
        'mixers': [],
    });

    if(!user){
        console.log('user could not be created');
    }

    return user;
}

userSchema.statics.updateSpotifyTokens = async function(userID, accessToken, refreshToken){
    if( !userID || !accessToken || !refreshToken ){
        throw Error('All fields must be filled');
    }

    const query = { 'userID': userID }; // Specify the field and its value to find the document
    const update = {
        $set: {
            'accessToken': accessToken,
            'refreshToken': refreshToken,
        },
    };
    const options = {
        new: true, // Return the modified document instead of the original
    };

    let user;
    try{
        user = await this.findOneAndUpdate(query, update, options);
    }catch(err){
        console.log('findoneandupdate err: ', err);
    }
    return user;
}

userSchema.statics.info = async function(userID){
    if(!userID){
        throw Error('No userID provided');
    }
    const user = await this.findOne({'userID': userID});
    return user;
}

userSchema.statics.login = async function(email, password){
    if(!email || !password){
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({'email': email});

    if(!user){
        throw Error('incorrect email');
    }
    
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        throw Error('Incorrect paswword');
    }

    return user;
}

module.exports = mongoose.model('User', userSchema);