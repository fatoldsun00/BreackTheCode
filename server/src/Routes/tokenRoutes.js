const express = require('express')
const tokenRouter = express.Router()
const {TokensCtrl} = require('../Controllers/tokensController')
const catchAsync = require('../Services/catchAsync')

tokenRouter.route('/')
  .get(catchAsync(async ( req, res, next ) => {
    const tokens = TokensCtrl.getTokens()
    res.locals.status = 200
    res.locals.message =  tokens
    next()
  }))
  

module.exports = tokenRouter;
