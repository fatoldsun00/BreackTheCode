let mocks = {
  newG: {
    "idGame":"xz8bgdjx6",
    "idRoom":"g2l4oli2h",
    "countPlayers":2,
    "countBots":0,
    "started":true,
    "players":[{
      "name":"ss",
      "clues":[
        {"card":"8","rep":[0]},
        {"card":"9","rep":[],"choice":2},
        {"card":"17","rep":8},
        {"card":"13","rep":["4"],"choice":8},{"card":"4","rep":9}]
      },{
      "name":"e",
      "clues":[
        {"card":"11","rep":[]},
        {"card":"2","rep":1},
        {"card":"19","rep":2},
        {"card":"1","rep":4},
        {"card":"3","rep":16}]
    }],
    "leader":"ss",
    "firstPlayer":"ss",
    "turn":{"actifCard":"18","actifPlayer":"ss","answered":["ss"]},
    "cardsPile":[
      {"id":21,"label":"Quelle est la somme de tous tes chiffres","regExResponse":"/[0-9]{0,2}/","typeResponse":"Number","mathForm":"sum [A,B,C,D,E]"},
      {"id":10,"label":"Où sont tes tuiles 3 ou tes tuiles 4","choice":[3,4],"regExResponse":"[]","typeResponse":"Array","mathForm":"where [choice]"},
      {"id":6,"label":"Quelle est la somme des chiffres de tes trois tuiles gauche","regExResponse":"/[0-9]{0,2}/","typeResponse":"Number","mathForm":"sum [A,B,C]"},
      {"id":7,"label":"Quelle est la somme des chiffres de tes trois tuiles de droite","regExResponse":"/[0-9]{0,2}/","typeResponse":"Number","mathForm":"sum [C,D,E]"},
      {"id":12,"label":"Où sont tes tuiles 6 ou tes tuiles 7","choice":[6,7],"regExResponse":"[]","typeResponse":"Array","mathForm":"where [choice]"}],
    "cards":[
      {"id":14,"label":"Où sont tes tuiles voisines avec des chiffres de même couleur","regExResponse":"[]","typeResponse":"MultiArray","mathForm":"where [follow col]"},
      {"id":18,"label":"Combien de tuiles avec des chiffres égaux as tu ","regExResponse":"/[0-2]/","typeResponse":"Number","mathForm":"where [X = Y]"},
      {"id":5,"label":"Quelle est la somme des chiffres de tes tuiles centrales","regExResponse":"/[0-9]{0,2}/","typeResponse":"Number","mathForm":"sum [B,C,D]"},
      {"id":15,"label":"Est-ce que le chiffre de ta tuile C est-elle strictement superieur à 4","regExResponse":"/(true|false|[0-1])/i","typeResponse":"Boolean","mathForm":"C > 4"},
      {"id":20,"label":"Où sont tes tuiles dont les chiffres se suivent","regExResponse":"[]","typeResponse":"MultiArray","mathForm":"where [X,X+1]"},
      {"id":16,"label":"Combien de tuiles avec un chiffre pair as-tu","regExResponse":"/[0-5]/","typeResponse":"Number","mathForm":"count even"}],
    "cardsDiscard":[
      {"id":11,"label":"Où sont tes tuiles 5","regExResponse":"[]","typeResponse":"Array","mathForm":"where 5"},
      {"id":8,"label":"Où sont tes tuiles 0","regExResponse":"[]","typeResponse":"Array","mathForm":"where 0"},
      {"id":2,"label":"Combien de chiffres noir as-tu","regExResponse":"/[0-5]/","typeResponse":"Number","mathForm":"count black"},
      {"id":9,"label":"Où sont tes tuiles 1 ou tes tuiles 2","choice":2,"regExResponse":"[]","typeResponse":"Array","mathForm":"where [choice]"},
      {"id":19,"label":"Combien de tuiles avec un chiffre impair as-tu","regExResponse":"/[0-5]/","typeResponse":"Number","mathForm":"count flow"},
      {"id":17,"label":"Quelle est la différence entre ton plus grand chiffre et ton plus petit chiffre","regExResponse":"/[0-9]/","typeResponse":"Number","mathForm":"diff [E,A]"},
      {"id":1,"label":"Combien de chiffres blanc as-tu","regExResponse":"/[0-5]/","typeResponse":"Number","mathForm":"count white"},
      {"id":13,"label":"Où sont tes tuiles 8 ou tes tuiles 9","choice":8,"regExResponse":"[]","typeResponse":"Array","mathForm":"where [choice]"},
      {"id":3,"label":"Quelle est la somme des tes chiffres blancs","regExResponse":"/[0-9]{0,2}/","typeResponse":"Number","mathForm":"sum white"},
      {"id":4,"label":"Quelle est la somme des tes chiffres noirs","regExResponse":"/[0-9]{0,2}/","typeResponse":"Number","mathForm":"sum black"}],
    "lastTurn":false,
    "lastTurnPlayers":[],
    "winners":[],
    "finish":false,
    "tokens":[{"val":2,"col":"white"},{"val":2,"col":"black"},{"val":3,"col":"white"},{"val":4,"col":"white"},{"val":7,"col":"white"}]
  },
}


module.exports = {
  mocks
};