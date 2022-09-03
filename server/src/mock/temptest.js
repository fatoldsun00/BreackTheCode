

var jsonata = require("jsonata");

const Cards = [
  {
  id:1,
  label: "Combien de chiffres blanc as-tu",
  regExResponse: "/[0-5]/",
  typeResponse: "Number",
  mathForm: "count white",
  fn: (tokens)=>{
    return tokens.filter((t) => t.col=='white').length
  }
},{
  id:2,
  label: "Combien de chiffres noir as-tu",
  regExResponse: "/[0-5]/",
  typeResponse: "Number",
  mathForm: "count black",
  fn: (tokens)=>{
    return tokens.filter((t) => t.col=='black').length
  }
},{
  id:3,
  label: "Quelle est la somme des tes chiffres blancs",
  regExResponse: "/[0-9]{0,2}/",
  typeResponse: "Number",
  mathForm: "sum white",
  fn: (tokens)=>{
    return tokens.reduce((acc,t) => t.col=='white'? acc + t.val:acc,0)
  }
},{
  id:4,
  label: "Quelle est la somme des tes chiffres noirs",
  regExResponse: "/[0-9]{0,2}/",
  typeResponse: "Number",
  mathForm: "sum black",
  fn: (tokens)=>{
    return tokens.reduce((acc,t) => t.col=='black'? acc + t.val:acc,0)
  }
},{
  id:5,
  label: "Quelle est la somme des chiffres de tes tuiles centrales",
  regExResponse: "/[0-9]{0,2}/",
  typeResponse: "Number",
  mathForm: "sum [B,C,D]",
  fn: (tokens)=>{
    //TODO switch selon nbr joueurs
    return tokens[1].val+tokens[2].val+tokens[3].val
  }
},{
  id:6,
  label: "Quelle est la somme des chiffres de tes trois tuiles gauche",
  regExResponse: "/[0-9]{0,2}/",
  typeResponse: "Number",
  mathForm: "sum [A,B,C]",
  fn: (tokens)=>{
    //TODO switch selon nbr joueurs
    return tokens[0].val+tokens[1].val+tokens[2].val
  }
} ,{
    id:7,
    label: "Quelle est la somme des chiffres de tes trois tuiles de droite",
    regExResponse: "/[0-9]{0,2}/",
  typeResponse: "Number",
  mathForm: "sum [C,D,E]",
  fn: (tokens)=>{
     //TODO switch selon nbr joueurs
     return tokens[2].val+tokens[3].val+tokens[4].val
    }
},{
  id:8,
  label: "Où sont tes tuiles 0",
  regExResponse: "[]",
  typeResponse: "Array",
  mathForm: "where 0",
  fn: (tokens)=>{
    return (tokens.filter((t)=>t.val==0)).map((t,index)=>index)
  }
},{
  id:9,
  label: "Où sont tes tuiles 1 ou tes tuiles 2",
  choice: [1,2],
  regExResponse: "[]",
  typeResponse: "Array",
  mathForm: "where [choice]",
  fn: (tokens,playerChoice)=>{
    if ([1,2].indexOf(playerChoice) < 0) throw 'Erreur TODO'
    let arrRet = []
    for (k in tokens)
      if (tokens[k].val == playerChoice)
        arrRet.push(k)
    return arrRet
  }
},{
  id:10,
  label: "Où sont tes tuiles 3 ou tes tuiles 4",
  choice: [3,4],
  regExResponse: "[]",
  typeResponse: "Array",
  mathForm: "where [choice]",
  fn: (tokens,playerChoice)=>{
    if ([3,4].indexOf(playerChoice) < 0) throw 'Erreur TODO'

    let arrRet = []
    for (k in tokens)
    if (tokens[k].val == playerChoice)
      arrRet.push(k)
    return arrRet
  }
},{
  id:11,
  label: "Où sont tes tuiles 5",
  regExResponse: "[]",
  typeResponse: "Array",
  mathForm: "where 5",
  fn: (tokens)=>{
    let arrRet = []
    for (k in tokens)
      if (tokens[k].val == 5)
        arrRet.push(k)
    return arrRet
    //return jsonata(`$ ~> $map(function($token, $i) { $token.val = 5 ? $i})`).evaluate(tokens) || []
    //return jsonata(`$ ~> $map(function($token, $i) { $token.val = 5 ? $i+' '+ $token.val})`).evaluate(tokens) || []
  }
},{
  id:12,
  label: "Où sont tes tuiles 6 ou tes tuiles 7",
  choice: [6,7],
  regExResponse: "[]",
  typeResponse: "Array",
  mathForm: "where [choice]",
  fn: (tokens,playerChoice)=>{
    if ([6,7].indexOf(playerChoice) < 0) throw 'Erreur TODO'
    let arrRet = []
    for (k in tokens)
      if (tokens[k].val == playerChoice)
        arrRet.push(k)
    return arrRet
    return (tokens.filter((t)=>t.val==playerChoice)).map((t,i)=>i)
    return jsonata(`$ ~> $map(function($token, $i) { $token.val = ${choice} ? $i })`).evaluate(tokens) || []

  }
},{
  id:13,
  label: "Où sont tes tuiles 8 ou tes tuiles 9",
  choice: [8,9],
  regExResponse: "[]",
  typeResponse: "Array",
  mathForm: "where [choice]",
  fn: (tokens,playerChoice)=>{
    if ([8,9].indexOf(playerChoice) < 0) throw 'Erreur TODO'
    let arrRet = []
    for (k in tokens)
      if (tokens[k].val == playerChoice)
        arrRet.push(k)
    return arrRet
    return (tokens.filter((t)=>t.val==playerChoice)).map((t,i)=>i)
    return jsonata(`$ ~> $map(function($token, $i) { $token.val = ${choice} ? $i })`).evaluate(tokens) || []

  }
},{
  id:14,
  label: "Où sont tes tuiles voisines avec des chiffres de même couleur",
  regExResponse: "[]",
  typeResponse: "MultiArray",
  mathForm: "where [follow col]",
  fn: (tokens)=>{

    let i = 0
    let innerArr = []

    while (i < tokens.length) {
      let arrsplit = splitArr([])
      function splitArr (arr) {
        if (tokens[i+1] && tokens[i+1].col == tokens[i].col) {
          arr.push(i)
          i++
          splitArr(arr)
        } else { 
          if (tokens[i-1] && tokens[i-1].col == tokens[i].col) arr.push(i)
          i++ 
        }
        if (arr.length) return arr
      }
      if (arrsplit && arrsplit.length)  innerArr.push(arrsplit)
      else innerArr.push([i-1])
    }
    return innerArr
  }
},{
  id:15,
  label: "Est-ce que le chiffre de ta tuile C est-elle strictement superieur à 4",
  regExResponse: "/(true|false|[0-1])/i",
  typeResponse: "Boolean",
  mathForm: "C > 4",
  fn: (tokens)=>{
    return tokens[2].val > 4
  }
},{
  id:16,
  label: "Combien de tuiles avec un chiffre pair as-tu",
  regExResponse: "/[0-5]/",
  typeResponse: "Number",
  mathForm: "count even",
  fn: (tokens)=>{
    return tokens.filter((token) => token.val%2==0).length
  }
},{
  id:17,
  label: "Quelle est la différence entre ton plus grand chiffre et ton plus petit chiffre",
  regExResponse: "/[0-9]/",
  typeResponse: "Number",
  mathForm: "diff [E,A]",
  fn: (tokens)=>{
    return tokens[4].val - tokens[0].val
  }
},{
  id:18,
  label: "Combien de tuiles avec des chiffres égaux as tu ",
  regExResponse: "/[0-2]/",
  typeResponse: "Number",
  mathForm: "where [X = Y]",
  fn: (tokens)=>{
    let arrVal = tokens.map((token)=>{
      return token.val
    })
    //On soutrait le tableau vec doublons du tableau sans doublons (malin !)
    return (arrVal.length - [...new Set(arrVal)].length)*2;
  }
},{
  id:19,
  label: "Combien de tuiles avec un chiffre impair as-tu",
  regExResponse: "/[0-5]/",
  typeResponse: "Number",
  mathForm: "count flow",
  fn: (tokens)=>{
    return tokens.filter((token) => token.val%2!=0).length
  }
},{
  id:20,
  label: "Où sont tes tuiles dont les chiffres se suivent",
  regExResponse: "[]",
  typeResponse: "MultiArray",
  mathForm: "where [X,X+1]",
  //TODO ?
  fn: (tokens)=>{
    let i = 0
    let innerArr = []

    while (i < tokens.length) {
      let arrsplit = splitArr([])
      function splitArr (arr) {
        if (tokens[i+1] && tokens[i+1].val == tokens[i].val+1) {
          arr.push(i)
          i++
          splitArr(arr)
        } else { 
          if (tokens[i-1] && tokens[i-1].val == tokens[i].val-1) arr.push(i)
          i++ 
        }
        if (arr.length) return arr
      }
      if (arrsplit && arrsplit.length)  innerArr.push(arrsplit)
    }
    return innerArr
  }
},{
  id:21,
  label: "Quelle est la somme de tous tes chiffres",
  regExResponse: "/[0-9]{0,2}/",
  typeResponse: "Number",
  mathForm: "sum [A,B,C,D,E]",
  fn: (tokens)=>{
    return tokens.reduce((acc,token) => {return acc + token.val},0)
  }
}]

const tokens=[{"val":1,"col":"white"},{"val":2,"col":"white"},{"val":5,"col":"green"},{"val":5,"col":"black"},{"val":9,"col":"black"}]
const tokens2=[{"val":0,"col":"white"},{"val":0,"col":"black"},{"val":5,"col":"green"},{"val":6,"col":"black"},{"val":6,"col":"black"}]
const tokens3=[{"val":1,"col":"white"},{"val":5,"col":"green"},{"val":3,"col":"green"},{"val":7,"col":"white"},{"val":8,"col":"black"}]
const tokens4=[{"val":1,"col":"white"},{"val":2,"col":"black"},{"val":3,"col":"green"},{"val":7,"col":"white"},{"val":8,"col":"black"}]

let idCard = 13
console.log(Cards[idCard].label)

console.log('tokens :', Cards[idCard].fn(tokens))
console.log('tokens2 :', Cards[idCard].fn(tokens2))
console.log('tokens3 :', Cards[idCard].fn(tokens3))
console.log('tokens4 :', Cards[idCard].fn(tokens4))
/*
console.log('tokens :', Cards[idCard].fn(tokens,"8"))
console.log('tokens2 :', Cards[idCard].fn(tokens2,"8"))
console.log('tokens3 :', Cards[idCard].fn(tokens3,"9"))
console.log('tokens4 :', Cards[idCard].fn(tokens4,"9"))*/
