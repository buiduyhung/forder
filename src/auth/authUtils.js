'use strict'

const JWT = require('jsonwebtoken');
// const { asyncHandler } = require('./checkAuth');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');
const { asyncHandler } = require('../helpers/asyncHandler');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // Kiểm tra xem publicKey và privateKey có hợp lệ không
        if (!publicKey || !privateKey) {
            console.error("Invalid keys:", { publicKey, privateKey });
            return null; // Nếu không hợp lệ, trả về null
        }

        // Tạo accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        });

        // Tạo refreshToken
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        });

        // Kiểm tra thông tin của accessToken
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`Error verifying accessToken::`, err)
            } else {
                console.log(`Decoded accessToken::`, decode)
            }
        });

        return { accessToken, refreshToken }
    } catch (error) {
        console.error('Error creating tokens:', error)
        return null;
    }
}

const authentication = asyncHandler( async (req, res, next) => {
    /*
        1 - check userId missing???
        2 - get accessToken
        3 - verifyToken
        4 - check user in bds?
        5 - check keyStore with this userId?
        6 - OK all => return next()
    */

    const userId = req.headers[HEADER.CLIENT_ID]
    console.log("User ID from header:", userId);
    if (!userId) throw new AuthFailureError('Invalid request')
    
    //2
    const keyStore = await findByUserId(userId)
    if (!userId) throw new NotFoundError('Not found keyStore')
    
    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!userId) throw new AuthFailureError('Invalid request')

    try{
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
        req.keyStore = keyStore

        // console.log('Test: ', req.keyStore)
        return next()
    }catch (e) {
        throw e
    }    
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
};
