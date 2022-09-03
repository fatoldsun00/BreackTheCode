
const { Cards } = require('../Models/cardsModel')

const CardsCtrl = (() => {
  const newPile = () =>  {
    let cartesShuffled
    try {
      cartesShuffled = Cards.slice();
      for (let i = cartesShuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartesShuffled[i], cartesShuffled[j]] = [cartesShuffled[j], cartesShuffled[i]];
      }
    } catch (err) {
      console.log(err)
    }
   
    return cartesShuffled
  }

  /*const getCards = (idCarte) =>  {
    return Cards.filter(carte => carte.id==idCarte)[0]
  }*/
  return {
    newPile,
   // getCarte
  }
})()

module.exports = {
  CardsCtrl
};
