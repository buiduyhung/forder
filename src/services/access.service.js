'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { type } = require("os")
const { getInfoData } = require("../utils")
const { BadRequestError } = require("../core/error.response")

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
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