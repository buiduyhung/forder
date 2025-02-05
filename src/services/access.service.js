'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            // step1: check email exits??
            const hodleShop = await shopModel.findOne({email}).lean()

            if(hodleShop){
                return {
                    code: 'xxxxx',
                    message: 'Shop already registered!'
                }
            }

            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [roleShop.SHOP]
            })

            if(newShop){
                // created privatekey, publickey
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                })

                console.log({ privateKey, publicKey }) // save collection keyStore
            }

        }catch (error){
            return {
                code: 'xxxxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}


module.exports = AccessService