'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { type } = require("os")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")
const { token } = require("morgan")
const { console } = require("node:inspector")

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static handlerRefreshTokenV2 = async ( {keyStore, user, refreshToken} ) => {
        const { userId, email } = user || {};

        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('something wrng happened !! please relogin')
        }

        if(keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered')

        const foundShop = await findByEmail({email})
        if (!foundShop) throw new AuthFailureError('Shop not registered 2')

        // create new token
        const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)

        // update token
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user,
            tokens
        }
    }

    static logout = async(keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        return delKey
    }

    /*
        check this token used?
    */
    static handlerRefreshToken = async ( refreshToken) => {
        // check xem token da duoc su dung chua
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        console.log('Token used: ' ,foundToken)
        if(foundToken) {
            // decode xem token nay la ai?
            const {useId, email} = await verifyJWT(refreshToken, foundToken.privateKey) 
            console.log('[1]::', {userId, email})
            // xoa tat ca token trong keys
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('something wrng happened !! please relogin')
        }


        // No, qua ngon
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('Shop not registered 1')

        // verifyToken
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('[2]::', {userId, email})
        // check userId
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new AuthFailureError('Shop not registered 2')

        // create new token
        const tokens = await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey)

        // update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user: {userId, email},
            tokens
        }
    }

    static logout = async(keyStore) => {
        console.log('delKey1: ',{keyStore})
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log('delKey: ',{keyStore})
        return delKey
    }


    /* 
        1 - check email in dbs
        2 - match password
        3 - create AT vs RT and save
        4 - generate tokens
        5 - get data return login
    */
    static login = async({email, password, refreshToken = null}) => {
        
        //1.
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new BadRequestError('Shop not registered !')

        //2.
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication error')

        //3.
        // created privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');
        //4 - generate tokens
        // const { _id: userId } = foundShop
        const tokens = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId: foundShop._id
        })

        return {
            shop: getInfoData({ files: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        // try {
            // Kiểm tra nếu email đã tồn tại trong cơ sở dữ liệu
            const hodleShop = await shopModel.findOne({ email }).lean()

            if (hodleShop) {
                throw new BadRequestError('Error: Shop already registered!')
            }

            // Mã hóa mật khẩu
            const passwordHash = await bcrypt.hash(password, 10)
            
            // Tạo mới shop
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [roleShop.SHOP]
            })

            if (newShop) {
                // Tạo cặp khóa RSA
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1', // public key cryptography standard
                //         format: 'pem',
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem',
                //     },
                // });

                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                // Lưu khóa vào cơ sở dữ liệu hoặc thực hiện thao tác lưu trữ
                console.log('Private Key:', privateKey)
                console.log('Public Key:', publicKey)

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if(!keyStore){
                    return {
                        code: 'xxxxx',
                        message: 'keyStore error'
                    }
                }
                console.log(`keyStore::`, keyStore)
                // const publicKeyObject = crypto.createPublicKey( publicKeyString )

                // created tolen pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                if (tokens) {
                    console.log('Created token success::', tokens)
                } else {
                    console.log('Token creation failed')
                }

                return {
                    code: '201',
                    metadata: {
                        shop: getInfoData({ files: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                }
            }

            return {
                code: '200',
                metadata: null
            }

        // } catch (error) {
        //     console.error(error); // Log lỗi để dễ dàng debug
        //     return {
        //         code: 'xxxxx',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }
}


module.exports = AccessService