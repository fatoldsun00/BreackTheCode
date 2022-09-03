const app = require('express')
const frontRouter = app.Router()
const { UsersCtrl } = require('../Controllers/usersController')
const AppError = require('../Services/AppError')
const { sFrontError } = require('../Services/errorHandler')

//verif si authentifié
frontRouter.use(async (req,res,next) => {
  if (!/^\/user\/?$/.test(req.path) || req.method != "POST") {
    try{
      //Controle Cookies
      const jwdDecoded = await UsersCtrl.checkTokenUser(req.cookies.access_token)
      res.locals.name = jwdDecoded.name
    } catch (err) {
      res.cookie('access_token', undefined, { expires: 0, maxAge: 0 })
      next(err)
    }
  }
  next()
})

// Routes
const userRoutes = require('./userRoutes')
const gameRoutes = require('./gameRoutes')
const chatRoutes = require('./chatRoutes')
const tokenRoutes = require('./tokenRoutes')

//Montage des routes
frontRouter.use('/user', userRoutes)
frontRouter.use('/game', gameRoutes)
frontRouter.use('/chat', chatRoutes)
frontRouter.use('/token', tokenRoutes)

//envoie de la response
frontRouter.use(async (req, res, next) => {
  try{
    if (res.locals.status==undefined) throw new AppError(404, 'RETURN UNDEFINED')
    res.status(res.locals.status).json(res.locals.message)
  }catch(err){
    next(err)
  }
})
//Handle error
frontRouter.use(sFrontError)

module.exports = frontRouter
