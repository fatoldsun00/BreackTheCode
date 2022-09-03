
const { Tokens } = require('../Models/tokensModel')

const TokensCtrl = (() => {

  const generateTokens = (countPlayers) => {
    try{
      //On clone les jetons
      let tempTokens = Tokens.slice()
      let arrTokensPlayers = []
      //Distribution
      for(let countTokens=0;countTokens<(countPlayers*5);countTokens++) {
          let indexRandom = Math.floor(Math.random() * tempTokens.length) 
          if (!arrTokensPlayers[(countTokens%countPlayers)]) arrTokensPlayers[(countTokens%countPlayers)] = []
          arrTokensPlayers[(countTokens%countPlayers)].push(tempTokens[indexRandom])
          tempTokens.splice(indexRandom,1 )
      }
  
      //sort des chiffres et des couleurs
      for(k in arrTokensPlayers) {
        arrTokensPlayers[k]=arrTokensPlayers[k].sort((a,b) => (a.val > b.val) ? 1 : ((b.val > a.val) ? -1 : ((b.coul=='blanc') ? -1 : 1)))
      }
      return arrTokensPlayers
    } catch (err) {
      console.log(err)
    }
  }

  const getTokens = () => {
    return JSON.parse(JSON.stringify(Tokens))
  }
  return {
    generateTokens,
    getTokens
  }
  /****************************** Private *******************************************/
})()

module.exports = {
  TokensCtrl
};
