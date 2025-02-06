'use strict'

const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // Kiểm tra xem publicKey và privateKey có hợp lệ không
        if (!publicKey || !privateKey) {
            console.error("Invalid keys:", { publicKey, privateKey });
            return null; // Nếu không hợp lệ, trả về null
        }

        // Tạo accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        });

        // Tạo refreshToken
        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        });

        // Kiểm tra thông tin của accessToken
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`Error verifying accessToken::`, err);
            } else {
                console.log(`Decoded accessToken::`, decode);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error creating tokens:', error);
        return null; // Trả về null nếu gặp lỗi
    }
};

module.exports = {
    createTokenPair
};
