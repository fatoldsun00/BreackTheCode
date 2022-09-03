<template>
  <div v-if="!loading" class="gameView">
    <div class="gameView__L gameView__L--1">
      <Tongue classTarget="gameView__L" classBEMTarget="gameView" :developper="!game.started"/>
      <div class="gameView__cluesTokens">
        <TokensClues :players="game.players" :cards="game.cardsDiscard"/>
      </div>
      <div class="gameView__info"> 
        <div>ID : {{idGame}}</div>
        <div>Démarré : {{game.started}}</div>
        <div>Humain : {{game.countPlayers - game.countBots}}</div>
        <div>Bots : {{game.countBots}}</div>
        <div>Joueurs dans la partie : {{game.players.length}}</div>
        <button v-show="!game.started" @click="startGame()">démarrer</button>
        <button @click="$router.push({ name: 'home', params: { } })">Accueil</button>
      </div>
    </div>  
    <div class="gameView__L gameView__L--2">
      <Tongue classTarget="gameView__L" :developper="!game.started" classBEMTarget="gameView"/>
      <div class="gameView__card-container">
          <Card v-for="card in game.cards" :key="card.id" 
            :cardDisplay="cardDisplay" :card="card" 
            :actifCard="parseInt(game.turn.actifCard)" :isActifPlayer="game.turn.actifPlayer==name"
            @update:cardDisplay="displayCard($event)" 
            @card:pickupCard="pickupCard($event)"
            @card:responseToCard="responseToCard($event)"
            :class="{['gameView__element--disabled']:game.lastTurn}"
            />
            <button @click="propositionVisible=true">Proposition</button>
      </div>
      
      <div class="gameView__chat"> 
        <Chat :idRoom="game.idRoom" />
      </div>
    </div>
    <div class="gameView__L gameView__L--3" >
      <Tongue classTarget="gameView__L" classBEMTarget="gameView" :display="game.started" 
        :developper="game.turn.actifCard != null && game.turn.actifPlayer != name"/>
      <div class="gameView__blockIndicesJoueurs">
        Indice
        <PlayersClues :players="game.players" :cards="game.cardsDiscard"/>
      </div>
      <div class="gameView__tokens"> 
        <Tokens :tokens="game.tokens"/> 
      </div>
    </div>
    <div class="gameView__L gameView__L--4" >
      <div class="gameView__players"> 
        Tour de jeu
        <Players :players="game.players" :name="name" :leader="game ? game.leader:null"  :actifPlayer="game && game.turn ? game.turn.actifPlayer:null"/>
      </div>
    </div>
    <Proposition :propositionVisible.sync="propositionVisible" :idGame="idGame"/>
    <ResultGame :resultGameVisible.sync="resultGameVisible" :idGame="idGame"/>
  </div>
</template>

<script>

import { HTTP } from '../axios-wrapper' 
import Card from '@/components/Card'
import Players from '@/components/Players'
import PlayersClues from '@/components/PlayersClues'
import Chat from '@/components/Chat'
import Tokens from '@/components/Tokens'
import TokensClues from '@/components/TokensClues'
import Tongue from '@/components/Tongue'
import Proposition from '@/components/Proposition'
import ResultGame from '@/components/ResultGame'

/* eslint-disable no-console */
export default {
  data: function () {
    return {
      idGame: this.$route.params.idGame,
      game: {},
      onMessagefnID: undefined,
      name: this.$store.getters['user/getName'],
      cardDisplay: null,
      loading: true,
      propositionVisible: false,
      resultGameVisible: false,
    }
  },

  components: {
    Card,
    Players,
    Chat,
    Tokens,
    Tongue,
    PlayersClues,
    TokensClues,
    Proposition,
    ResultGame
  },
  computed: {
    actifCard(){
      return this.game.turn.actifCard
    }
  },
  methods: {
    async startGame(){
      try {
        await HTTP.post(`/game/start/${this.idGame}`)
        //this.idGame = idGame
      } catch (err) {
        this.$message({
          showClose: false,
          message: err.data.errmsg,
          type: 'error'
        })
      }
    },
    displayCard(idCarte){
      console.log('clickckckcckckk',this.game.turn.actifPlayer,this.name,!this.game.turn.actifCard);
      //console.log(this.game.turn.actifPlayer == this.name, !this.game.turn.actifCard,idCarte);
      if (this.game.turn.actifPlayer == this.name && !this.game.turn.actifCard) {
        this.cardDisplay = idCarte
      }
    },
    async pickupCard(data){
      try {
        await HTTP.post(`/game/pickupCard/${this.idGame}/${this.cardDisplay}`,{choice: data.choice})
      } catch (err) {
        this.$message({
          showClose: false,
          message: err.data.errmsg,
          type: 'error'
        })
      }
    },
    async responseToCard(response){
      try {
        await HTTP.post(`/game/responseToCard/${this.idGame}/${this.actifCard}`,response)
      } catch (err) {
         this.$message({
          showClose: false,
          message: err.data.errmsg,
          type: 'error'
        })
      }
    }
  },
  async created(){
    //On reference la partie active dans le store
    //Recuperation des informations de la partie
    try {
      this.name = this.$store.getters['user/getName']

      let { data } = await HTTP.get(`/game/${this.idGame}`)

      this.game = data
      //Dernier tour
      if(this.game.lastTurnPlayers.indexOf(this.name) > -1) this.propositionVisible=true
      if(this.game.finish) this.resultGameVisible = true
      this.loading=false

      this.onMessagefnID = await this.$store.dispatch('WS/add_fn', {
        fn: (message) => {
          //nouveau joueur
          if (message.action.newPlayer) {
            this.game.players = message.players
            this.$message({
              showClose: false,
              message: message.action.newPlayer+' a rejoint la partie',
              type: 'info'
            })
          }

          //demarrage partie
          if (message.action.started) {
            this.game = message.game
            this.$message({
              showClose: false,
              message: 'Partie démarré',
              type: 'success'
            })
          }

          //pickup card
          if (message.action.pickupCard) {
            this.game = message.game
            this.$message({
              showClose: false,
              message: message.player+ ' a selectionné une carte',
              type: 'info'
            })
          }

          //response to card
          if (message.action.responseToCard) {
            this.game = message.game
            this.$message({
              showClose: false,
              message: message.player+ ' a repondu',
              type: 'sucess'
            })
          }

          //Nouveau tour
          //TODO
          if (message.action.nextTurn) {
            this.game = message.game
            this.$message({
              showClose: false,
              message: 'Nouveau tour',
              type: 'sucess'
            })
          }

          //Retour proposition
          if (message.action.proposition) {
            this.game = message.game
            this.$message({
              showClose: false,
              message: message.player+ ' propose ' + message.proposition,
              type: message.action.proposition.result?'sucess':'danger'
            })
            //TODO test status partie
            if (this.game.lastTurn) {
              this.$message({
                showClose: false,
                message: "Dernier Tour todo",
                type: 'info'
              })
              if(this.game.lastTurnPlayers.indexOf(this.name) > -1) this.propositionVisible=true
            }
          }
          
          //Retour proposition
          if (message.action.finish) {
             this.game = message.game
             this.resultGameVisible = true
          }
        } 
      })
    } catch (err) {
      //TODO ERR
      console.log(err)
      this.$router.push({ name: 'home', params: { } })
    }
  },
  destroyed () {
    this.$store.commit('WS/remove_fn', this.onMessagefnID)
  }
}
</script>
