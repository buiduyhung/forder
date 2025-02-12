'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()
const { authentication, authenticationV2 } = require('../../auth/authUtils')
const { asyncHandler } = require('../../helpers/asyncHandler')

// signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

// authentication
router.use(authenticationV2)
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))


module.exports = router