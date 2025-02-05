'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'key'
const COLLECTION_NAME = 'keys'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop',
    },
    publicKey:{
        type: String,
        required: true
    },
    refreshToken:{
        type: Array,
        default: [],
    }
},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);