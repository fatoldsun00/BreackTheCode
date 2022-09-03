const express = require('express')
const gameRouter = express.Router()
const { GamesCtrl } = require('../Controllers/gamesController')
const catchAsync = require('../Services/catchAsync')
const { wss } = require('../Controllers/WSServerController')
var jsonata = require("jsonata");


gameRouter.route('/')
  .get(catchAsync(async ( req, res, next ) => {   //Get all games
    try {
      const games = await GamesCtrl.getGames()
      res.locals.status = 200
      res.locals.message = games
      return next()
    } catch (err) {
      throw err
    }
  }))
  .post(catchAsync(async ( req, res, next ) => {    //Create game
      try {       
        const idGame = GamesCtrl.createGame(req.body)
        res.locals.status = 200
        res.locals.message = idGame
        wss.send({
            action: {newGame: idGame}
        },wss.getClients())  

        next()
      } catch (err) {
        throw err
      }
  }))


gameRouter.route('/:idGame')
  .get(catchAsync(async ( req, res, next ) => {      //get a party
    try {
      const game = await GamesCtrl.getGame(req.params.idGame)
      if (game) {
        res.locals.status = 200
        res.locals.message = game.finish?game:GamesCtrl.cleanGameForSend(game,res.locals.name)//game
      } else {
        res.locals.status = 404
      }
      next()
    } catch (err) {
      throw err
    }
  }))

gameRouter.route('/start/:idGame')
  .post(catchAsync(async ( req, res, next ) => {   //start game
  try {
    let game = await GamesCtrl.startGame(req.params.idGame,res.locals.name)
    
    for(player of game.players) {
      wss.send({
        action: {started: true},
        game: GamesCtrl.cleanGameForSend(game,player.name)
      },player.name)  
    }
   
    res.locals.status = 201
    next()
  } catch (err) {
    throw err
  }
}))

gameRouter.route('/join/:idGame')
  .post(catchAsync(async ( req, res, next ) => {      //Join game
  try {
    const game = GamesCtrl.joinGame(req.params.idGame,res.locals.name)
    wss.send({  
      action: {newPlayer: res.locals.name},
      players: game.players
    }, jsonata(`players[name!='${res.locals.name}'].name`).evaluate(game))

    res.locals.status = 200
    res.locals.message = game
    next()
  } catch (err) {
    throw err
  }
}))

gameRouter.route('/pickupCard/:idGame/:idCard')        //Pickup card
  .post(catchAsync(async ( req, res, next ) => {
  try {
    let game = GamesCtrl.getGame(req.params.idGame)
    await GamesCtrl.pickupCard(req.params.idGame,req.params.idCard,res.locals.name,req.body.choice || null)

    for(player of game.players) {
      wss.send({
        action: {pickupCard: game.turn.actifCard},
        player: res.locals.name,
        game: GamesCtrl.cleanGameForSend(game,player.name)
      },player.name)  
    }
   
    res.locals.status = 201
    next()
  } catch (err) {
    throw err
  }
}))

gameRouter.route('/responseToCard/:idGame/:idCarte')          // Reponse
  .post(catchAsync(async ( req, res, next ) => {
  try {
    let game = GamesCtrl.getGame(req.params.idGame)
    let rep = await GamesCtrl.responseToCard(req.params.idGame,req.params.idCarte,req.body.response,res.locals.name)
  
    for(player of game.players) {
      wss.send({
        action: {responseToCard: game.turn.actifCard},
        game: GamesCtrl.cleanGameForSend(game,player.name),
        player:res.locals.name
      },player.name)  
    }

    //Si toute le monde a repondu
    if (game.turn.answered.length == game.players.length) {
      GamesCtrl.nextTurn(game.idGame)

      for(player of game.players) {
        wss.send({
          action:  {nextTurn: true},
          game: GamesCtrl.cleanGameForSend(game,player.name)
        },player.name)  
      }
      
      /*wss.send({
        action: {nextTurn: true},
        game
      },jsonata(`players.name`).evaluate(game))*/
    } 

    res.locals.status = 201
    next()
  } catch (err) {
    throw err
  }
}))


gameRouter.route('/param/:idGame')
  .post(catchAsync(async( req, res, next ) => {
  try {
    GamesCtrl.paramGame (req.params.idGame,res.locals.name,req.body.config)
    /*game = GamesCtrl.cleanGameForSend(game,res.locals.name)
    wss.send({
      action: {param: game},
      game,
    },Object.keys(game.joueurs))*/

    res.locals.status = 201
    next()
  } catch (err) {
    throw err
  }
}))

gameRouter.route('/proposition/:idGame')
  .post(catchAsync(async( req, res, next ) => {
  try {
    let game = GamesCtrl.getGame(req.params.idGame)
    const propositionResult = GamesCtrl.proposition(req.params.idGame,res.locals.name,req.body.propositions)    
    for(player of game.players) {
      wss.send({
        action: {
          proposition: {result: propositionResult},
        },
        game: GamesCtrl.cleanGameForSend(game,player.name),
        proposition: req.body.propositions,
        player: res.locals.name,
      },player.name)  
    }

    //Game finish
    if (game.finish) {
      wss.send({
        action: {
          finish: true,
        },
        game,
      },jsonata(`players.name`).evaluate(game))  
    }

    res.locals.status = 201
    next()
  } catch (err) {
    throw err
  }
}))

module.exports = gameRouter;
