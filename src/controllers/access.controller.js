"use strict"

const AccessService = require("../services/access.service")
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class AccessController {

  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Get token successfully",
      metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
    }).send(res)
  }

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logged out successfully",
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  }

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res)
  }

  signUp = async (req, res, next) => {
    // try {
    //   console.log(`[P]::signUp::`, req.body)
    //     /* 
    //         200 OK
    //         201 CREATED
    //      */
        new CREATED({
          message: "User created successfully",
          metadata: await AccessService.signUp(req.body),
          options: {
            limit: 10
          }
        }).send(res)

        // return res.status(201).json(await AccessService.signUp(req.body))

    // } catch (error) {
    //   next(error)
    // }
  }
}

module.exports = new AccessController()
