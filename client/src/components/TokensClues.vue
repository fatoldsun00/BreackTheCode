<template>
  <div class="tokensClues">
    <div class="cluesTokens__player" v-for="player in tokensClues" :key="player.name">
      <div class="cluesTokens__tokens tokens">
        <div v-for="(token,index) in player.tokens" :key="index" class="tokens__container">
          <div :data-tokenVal="token.val" class="tokens__token" 
            :class="'tokens__token--'+token.col + ' ' +'tokens__token--'+token.val+' '+(token.eliminate ? 'tokens__token--eliminate' : '')"
            @click="switchElmination(token)">
              {{token.val}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { HTTP } from '../axios-wrapper' 

export default {
  name: 'TokensClues',
  data: function () {
    return {
      humanElimination: true,
      tokensClues: []
    }
  },
  props: {
    tokens: Array,
    cards: Array,
    players: Array,
  },
  computed: {
    
  },
  watch: {
    
  },
  methods: {
    switchElmination(token) {
      if (this.humanElimination){
        token.eliminate = !token.eliminate
      }
    }
  },
  async created(){
      //Recuperation de tout les jetons pour les notes perso
      let { data } = await HTTP.get(`/token`)
      //attach token to player
      for(const player of this.players){
        console.log(player);
        //Ajout de l'info tuile eliminé
        let tokens = data.map(d=>{
          return {...d,eliminate:false}
        })
        this.tokensClues.push({name: player.name,tokens})
      }
  }

}
</script>
