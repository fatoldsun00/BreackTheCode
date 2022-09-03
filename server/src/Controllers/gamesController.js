
const { CardsCtrl } = require('./cardsController')
const { ChatCtrl } = require('./chatController')
const { TokensCtrl } = require('./tokensController')
const { Cards } = require('../Models/cardsModel')


const {mocks} = require('../mock/index')

var jsonata = require("jsonata");

const AppError = require('../Services/AppError')

const GamesCtrl = ((game) => {
  let games = []
  if (game) games = [game]

  const getGames = () => {
    return games
  }

  const getGame = (idGame) => {
    return jsonata(`$[idGame='${idGame}']`).evaluate(games)
  }

  const createGame = ( config ) => {
    try{
      let { countPlayers,countBots=0 } = config
      if (!countPlayers ||countPlayers < 2 || countPlayers > 4  || countBots < 0 || countPlayers > 3 || countPlayers+countBots > 4) throw new AppError(422,'ERR_GAME_CONFIG_MALFORMED')
      let idGame = Math.random().toString(36).substr(2, 9)
      let bots = []
      for(i in countBots){
        bots.push({bot: true,clues:[]})
      }
      //Creation de la room chat
      let idRoom = ChatCtrl.createRoom()
      games.push({
        idGame,
        idRoom,
        countPlayers,
        countBots,
        started: false,
        players: [...bots],
        leader: null,
        firstPlayer: null,
        turn: {
          actifCard: null,
          actifPlayer: null,
          answered:[]
        },
        cardsPile: [],
        cards: [],
        cardsDiscard: [],
        lastTurn: false,
        lastTurnPlayers: [],
        winners:[],
        finish: false
      })
      return idGame
    } catch (err) {
      throw err
    }
  }

  const joinGame = ( idGame,name ) => {
    try {
      if (!idGame || !name) throw  new AppError(422,'ERR_GAME_JOIN_INVALID_DATA')
      let game = getGame(idGame)
      let player = {
        name,
        clues: [],
      }
      //There are a leader or firstplayer ?
      game.leader=game.leader?game.leader:name
      game.firstPlayer=game.firstPlayer?game.firstPlayer:name

      const newPlayer = !(jsonata(`$count(players[name='${name}'])`).evaluate(game))
      if (newPlayer) {
        //Game started ?
        if (game.started) throw new AppError(422,'ERR_GAME_JOIN_GAME_ALREADY_STARTED')
        //Game full ?
        if (game.players.length >= game.countPlayers) throw new AppError(422,'ERR_GAME_JOIN_FULL')
        game.players.push(player)
        ChatCtrl.joinRoom(game.idRoom,name)
      }
     
      //Init clue
      //jsonata(`$ ~> | $ | {'players':{'name':'${name}','clues': {}}} |`).evaluate(game)
      //game.players[name] = {clues:{}}
      //Si on a pas de leader TODO
      //if(!jsonata(`players[leader]`).evaluate(game)) jsonata(`$ ~> | players[name='${name}'] | {'leader': true} |`).evaluate(game)
      //if (!Object.values(game.players).filter((joueur) => joueur.leader).length) game.players[name]={leader: true}
  /*
      if (Object.keys(game.players).length - game.countBots==0) {
        //On ajoute le joueur au jeu
        game.players[name]={leader: true}
      } else {
        game.players[name] = {}
      }*/
      //Ajout du players dans la room de chat
      
      return game
    }
    catch(err) {
      throw err
    }
  }

  const startGame = ( idGame, name ) => {
    try {
      let game = getGame(idGame)
      //Controle
      if (game.started) throw new AppError(422,'ERR_GAME_PARAM_GAME_ALREADY_STARTED')
      if (!jsonata(`players[name='${name}']`).evaluate(game)) throw new AppError(422,'ERR_GAME_START_YOU_ARE_NOT_IN_GAME')
      if (game.countPlayers != jsonata(`$count(players)`).evaluate(game)) throw new AppError(422,'ERR_GAME_START_PLAYER_NOT_FULL')
      if (game.leader != name) throw new AppError(401,'ERR_GAME_START_PLAYER_NOT_LEADER')

      return initGame(game)
    } catch (err) {
      throw err
    }
  }

  const pickupCard = (idGame,idCard,name,choice) => {
    try {
      let game = getGame(idGame)
      let indexCard = game.cards.findIndex(card=>card.id==idCard)
      //Test si on est sur le dernier tour ou selement les proposition sont accepté
      if (game.lastTurn) throw new AppError(401,'ERR_GAME_PICKUPCARD_CARD_LASTTURN_PROPOSITION_ONLY')
      //Test si joueur actif
      if (name!=game.turn.actifPlayer) throw new AppError(401,'ERR_GAME_PICKUPCARD_NOT_YOUR_TURN')
      //Test si la carte fait bien partie des 6 disponibles
      if (indexCard < 0) throw new AppError(401,'ERR_GAME_PICKUPCARD_CARD_NOT_IN_GAME')
      //Test si est bien le moment de piocher une carte
      if (game.turn.actifCard) throw new AppError(401,'ERR_GAME_PICKUPCARD_CARD_ALREADY_CHOOSE')

      let indexCardOrigin = Cards.findIndex(card=>card.id==idCard)

      if (Cards[indexCardOrigin].choice){
        if (!choice) throw new AppError(401,'ERR_GAME_PICKUPCARD_CARD_REQUIRED_CHOICE')
        if (Cards[indexCardOrigin].choice.indexOf(choice) < 0) throw new AppError(401,'ERR_GAME_PICKUPCARD_INVALID_CHOICE')
        game.cards[indexCard].choice = choice
      }
      game.turn.actifCard=idCard
      game.turn.answered.push(name)
    } catch (err){
      throw err
    }
  }

  const responseToCard = (idGame,idCard,response,name) => {
    try {
      let game = getGame(idGame)

      //Test si on est sur le dernier tour ou selement les proposition sont accepté
      if (game.lastTurn) throw new AppError(401,'ERR_GAME_PICKUPCARD_CARD_LASTTURN_PROPOSITION_ONLY')
      //Test si la response correspond a une carte actif
      if (game.turn.actifCard != idCard) throw new AppError(401,'ERR_GAME_RESPONSE_CARD_NOT_ACTIF_CARD')
      //Joueur qui pose la question qui y repond ?
      if (name == game.turn.actifPlayer) throw new AppError(401,'ERR_GAME_RESPONSE_IT_S_YOUR_TURN')
      //Test de la response
      const card = game.cards.find((card) => card.id == idCard)
      const tokens = jsonata(`players[name='${name}'].tokens`).evaluate(game)
      const rep = card.fn(tokens,card.choice)
      //compare array rep receive and rep calc
      if (rep instanceof Array) {
        if (rep.length != response.length   
              || !rep.every((value, index) => value == response[index])) throw new AppError(422,'ERR_GAME_RESPONSECARD_WRONG_RESPONSE')
        
      } else if (response != rep) throw new AppError(422,'ERR_GAME_RESPONSECARD_WRONG_RESPONSE')

      //On ajoute le joueur au tableau des players ayant joué ce turn ci
      game.turn.answered.push(name)
      
      //Ajout de l'indice a au joueurs qui repond, chaque joueur garde les reponses au questions concenrnant ses porpres jetons
      for (player of game.players) {
        if (player.name == name) {
          let pclues = {
            card: idCard,
            rep,
            //TODO tokensExclu:[]
          }
          if (card.choice) pclues.choice = card.choice
          player.clues.push(pclues)
        }
      }
      return rep
    } catch(err) {
      throw err
    }
  }

  const proposition = (idGame,name,propositions) => {
    try {
      let game = getGame(idGame)
      let tokens = []
      let propCorrect = true

      //TYpe de parti (2j ou 3/4j)
      if (game.players.length == 2) {
        if (propositions.length != 5) throw new AppError(401,'ERR_GAME_PROPOSITION_MALFORMED')
        tokens = game.players.find((player) => player.name!=name).tokens
      } else if (game.players == 3) {
        //TODO
        throw new AppError(400,'TODO partie a 3j a faire')
      } else if (game.players == 4) {
        //TODO
        throw new AppError(400,'TODO partie a 4j a faire')
      }
      //1er propo
      if (!game.lastTurn) {
        if (game.turn.actifPlayer != name) throw new AppError(401,'ERR_GAME_PROPOSITION_NOT_YOUR_TURN')
        if (game.turn.actifCard) throw new AppError(401,'ERR_GAME_PROPOSITION_CARD_ALREADY_CHOOSE')
        if (!propositions || !propositions.length) throw new AppError(401,'ERR_GAME_PROPOSITION_MALFORMED')
        
      
        for (let proposition of propositions){
          if (tokens.filter((token)=> token.val == proposition.val && token.col == proposition.col).length != 1) {
            //proposition fausse
            propCorrect = false
          }
        }
        
        if (propCorrect) {
          initLastTurn(game)
        } else {
          nextPlayer(game)
        }
      } else {
        //lastTurn for proposal
        if (game.lastTurnPlayers.indexOf(name) == -1) throw new AppError(401,'ERR_GAME_PROPOSITION_NO_MORE_TURN')
        for (let proposition of propositions){
          if (tokens.filter((token)=> token.val == proposition.val && token.col == proposition.col).length != 1) {
            //proposition fausse
            propCorrect = false
          }
        }
        //Suppression du joueur de la pile de joueur pouvant proposer
        game.lastTurnPlayers.splice(game.lastTurnPlayers.indexOf(name),1)
      }

      if (propCorrect){
        game.winners.push(name) 
      }

      if (game.lastTurn && !game.lastTurnPlayers.length) closeGame(game)

      return propCorrect
      
    } catch (err) {
      throw err
    }
  }

  const paramGame = ( idGame, name, config ) => {
    try{
      let game = getGame(idGame)
      if (!game.leader != name) throw new AppError(401,'ERR_GAME_PARAM_PLAYER_NOT_LEADER')
      game = {...game,countPlayers: config.countPlayers,countBots: config.countPlayers}
      validateGame(game)
      return game
    } catch (err) {
      throw err
    }
  }

  const cleanGameForSend = (game,name=undefined) => {
    // suppression des jetons des autres players
    let gameToReturn = JSON.parse(JSON.stringify(game))
    for (let player of gameToReturn.players) {
      if (name && player.name == name) {
        gameToReturn.tokens = player.tokens
      }/*else{
        delete player.clues
      }*/
      delete player.tokens
    }
    return gameToReturn
  }


  const nextTurn = (idGame) => {
    try {
      let game = getGame(idGame)

      //Si toute le monde a repondu
      if (game.turn.answered.length < game.players.length) throw new AppError(422,'ERR_GAME_NEXT_TURN_WAIT_FOR_PLAYER')

      //Gestion des cards
        //on passe la carte selectionné dans la defause
        game.cards.forEach((card,k)=> {
        if(card.id == game.turn.actifCard) game.cardsDiscard.push(game.cards.splice(k,1)[0])
      }) 

      // si il reste des cartes ds la pioche
      if (game.cardsPile.length) {
        //reset du turn
          //Nouvelle carte
        game.cards.push(game.cardsPile.splice(0,1)[0])
        game.turn.actifCard = null
        game.turn.answered = []
        nextPlayer(game)
      } else {
        //plus de carte ds la pioche
        initLastTurn(game)
      }
    } catch (err) {
      throw err
    }
    
  }

  /*--------------- Fonctions non expos&es, usage interne ---------------*/
  function initGame(game) {
    //initCarte
    game.cardsPile = CardsCtrl.newPile()
    //on prends les 6 premieres cards
    game.cards = game.cardsPile.splice(0,6)

    //initJetons
    const tokens = TokensCtrl.generateTokens(game.countPlayers)

    for (let player of game.players){
      player.tokens = tokens.splice(0,1)[0]
    }

    game.turn.actifPlayer = game.firstPlayer

    if (!game.turn.actifPlayer) game.turn.actifPlayer = game.players[0]

    game.started = true;
    return game
  }

  function validateGame(game) {
    try {
      //Game started
      if (game.started) throw new AppError(422,'ERR_GAME_PARAM_GAME_ALREADY_STARTED')
      if (game.countPlayers < Object.keys(game.players).length) throw new AppError(422,'ERR_GAME_PARAM_GAME_FULL')
      return
    } catch (err) {
      throw err
    }
  }

  function nextPlayer(game){
    //joueur suivant
    let indexPlayer=null
    game.players.forEach((player,k)=> {
      if (player.name == game.turn.actifPlayer) {
        indexPlayer=k
      }
    }) 
    game.turn.actifPlayer = (indexPlayer+1 >= game.players.length?game.players[0].name:game.players[indexPlayer+1].name)
  }

  function initLastTurn (game) {
    try {
      //let game = getGame(idGame)
      if (game.lastTurn) return

      game.lastTurn = true
      //Check for player who can play
      const firstPlayerIndex = game.players.findIndex((player) => player.name == game.firstPlayer)
      const actifPlayerIndex = game.players.findIndex((player) => player.name == game.turn.actifPlayer)
      const lastPlayerIndex = firstPlayerIndex - 1 >= 0 ? firstPlayerIndex - 1 : game.players.length-1
      //else init array player who can propose
      for (let k in game.players) {
        if ((k < firstPlayerIndex || k > actifPlayerIndex) && actifPlayerIndex != lastPlayerIndex) {
          game.lastTurnPlayers.push(game.players[k].name)
        }
      }

    } catch (err) {
      throw err
    }
  }

  function closeGame(game) {
    game.finish = true
    //throw ('TODO PARTIE FINI')
  }


  return {
    getGames,
    getGame, 
    createGame,
    cleanGameForSend,
    paramGame,
    joinGame,
    startGame,
    pickupCard,
    proposition,
    responseToCard,
    nextTurn,
    initLastTurn
  }
})((()=>{
  let cardsFN = jsonata('$.{"id":id,"fn":fn}').evaluate(Cards)
  let mock = mocks.newG
  let cards = mock.cards
  let cardsPile = mock.cardsPile
  let cardsDiscard = mock.cardsDiscard

  for (let card of cards){
    card.fn = jsonata('$[id='+card.id+'].fn').evaluate(cardsFN)
  }
  for (let card of cardsPile){
    card.fn = jsonata('$[id='+card.id+'].fn').evaluate(cardsFN)
  }
  for (let card of cardsDiscard){
    card.fn = jsonata('$[id='+card.id+'].fn').evaluate(cardsFN)
  }
  return mock
})())

module.exports = {
  GamesCtrl
};
