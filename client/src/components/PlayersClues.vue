<template>
  <div class="playersClues">
    <div class="playersClues__player" v-for="player in players" :key="player.name">
      {{player.name}}
      <div class="playersClues__clue" v-for="clue in player.clues" :key="clue.card">
        <div v-html="prettyClues(clue)"></div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PlayersClues',
  data: function () {
    return {
 
    }
  },

  props: {
    players: Array,
    cards: Array,
  },
  methods: {
    async send(){

    },
    prettyClues(clue){
      let mathForm = this.cards.find((c)=>c.id==clue.card).mathForm
      let card = this.cards.find((c)=>c.id==clue.card)

      if (mathForm.match(/^sum /)) {
        mathForm = mathForm.replace(/sum /,"&sum; ")
        //Somme de couleur
        mathForm = mathForm.replace(/black/,"<span class='playersClues__mathFormSum--black'></span>&nbsp;")
        mathForm = mathForm.replace(/white/,"<span class='playersClues__mathFormSum--white'></span>&nbsp;")
        
        //Si somme d'emplacement
        let txtClue = mathForm.match(/[[A-Z,]*]/)
        if (txtClue && txtClue[0]){
          txtClue = txtClue[0].match(/[A-Z]/g)
          let answer=[]
          for(let tclue of txtClue){
                answer.push(`<span class='playersClues__mathFormSlot'>${tclue}</span>`)
          }
          mathForm = answer.join(' + ')
        }

        mathForm += ' = '+clue.rep
      }

      if (mathForm.match(/^where /)) {
        let rep=''
        if (mathForm.search(/\[ ?x ?= ?y ?\]/gi) > -1) { //where [X = Y]
          rep+=`[<span class='playersClues__mathFormSlot'>X</span>&equiv;<span class='playersClues__mathFormSlot'>Y</span>] = ${clue.rep}`;
        } else if (mathForm.search(/[X,X+1]/) > -1) { //where [X,X+1]
          rep = '';
          if (clue.rep.length > 0) {
            for (let group of clue.rep) {
              let i = 0
              let startSlot = group[0]
              for (let slot of group) {
                rep+=`<span class='playersClues__mathFormSlot'>${i==0?String.fromCharCode('A'.charCodeAt(0)+startSlot):String.fromCharCode('A'.charCodeAt(0))+'+'+slot}</span> `;
                i++;
              }
            }
          } else {
            for(let index of Array(5).keys()) {
              rep+=`<span class='playersClues__mathFormSlot'>${String.fromCharCode('A'.charCodeAt(0) + index)}</span> `
            }
          }
        } else if (mathForm.search(/\[follow col\]/) > -1) { //where [follow col]
          rep = '';
          let colorSwitch = false
          for (let group of clue.rep) {
            colorSwitch = !colorSwitch
            for (let slot of group) {
              rep+=`<span class='playersClues__mathFormSlot playersClues__mathFormSlot--${colorSwitch?'black':'white'}'>${String.fromCharCode('A'.charCodeAt(0)+slot)}</span>`
            }
          }
        } else if (clue.rep instanceof Array) { //where [choice] || num
          let [choice] = mathForm.match(/[0-9]/) || [card.choice]
          if(clue.rep.length){
            for(let index of Array(5).keys()) {
              rep+=`<span class='playersClues__mathFormSlot'>${choice && clue.rep.indexOf(String(index)) > -1? choice : String.fromCharCode('A'.charCodeAt(0) + index)}</span> `
            }
          } else { 
              rep+=`<span class='playersClues__mathFormSlot playersClues__mathFormSlot--strike'>${choice}</span> `
          }
        } else {
          let choice = mathForm.match(/[0-9]|\[choice\]/)
          if (choice.length) 'Aucun '+ choice
        }

        mathForm = rep
      }

      if (mathForm.match(/^count /)) {
        let rep=''
        let color = null
        let evenFlow = null
        if (mathForm.match(/black/)) color='black'
        if (mathForm.match(/white/)) color='white'
        if (mathForm.match(/even/)) evenFlow='even'
        if (mathForm.match(/flow/)) evenFlow='flow'

        //Color
        if (color){
          if(clue.rep==0){
            rep+=`<span class='playersClues__mathFormCount playersClues__mathFormCount--${color}'></span> ` 
          }
          for(let i=0;i<clue.rep;i++){
            rep+=`<span class='playersClues__mathFormCount playersClues__mathFormCount--${color}'></span> ` 
          }
        }
        //Even or flow
        if (evenFlow){
          rep+=`<span class='playersClues__mathFormCount'>${clue.rep} ${evenFlow=="even"?"pair"+(clue.rep>1?"s":""):"impair"+(clue.rep>1?"s":"")}</span> ` 
        }

        mathForm = rep
      }

      if (mathForm.match(/diff /)) {
        //console.log(clue.rep);
        let txtClue = mathForm.match(/[[A-Z,]*]/)
        if (txtClue && txtClue[0]){
          txtClue = txtClue[0].match(/[A-Z]/g)
          let answer=''
          for(let tclue of txtClue){
                answer+=`<span class='playersClues__mathFormSlot'>${tclue}</span>`+' - '
          }
          mathForm = answer
        }
        mathForm += ' = '+clue.rep
      }

      return mathForm
    }
  },
}
</script>
