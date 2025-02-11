'use strict'

const keytokenModel = require("../models/keytoken.model")
const { Types } = require('mongoose')

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // level 0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // level xxx
            const filter = { user: userId }
            const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken }
            const options = { upsert: true, new: true }

            // level xxx
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            // level 0
            // return tokens? tokens.publicKey : null

            return tokens ? tokens.publicKey : null
        }catch (error) {
            return error
        }
    }

    static findByUserId = async ( userId ) => {
        return await keytokenModel.findOne({ user: userId}).lean()
    }

    static removeKeyById = async(id) => {
        const result = await keyTokenModel.deleteOne({
            _id:  new Types.ObjectId(id)
        })
        return result;
    }

}

module.exports = KeyTokenService