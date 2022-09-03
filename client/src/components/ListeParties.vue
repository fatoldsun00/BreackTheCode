<template>
  <div class="gamesList">
    <button @click="dialogVisible = true">creer partie</button>
    <div class="gamesList__container gamesList__container--entete">
      <div class="gamesList__element">ID</div>
      <div class="gamesList__element">Demarré</div>
      <div class="gamesList__element">Nombre Joueurs</div>
      <div class="gamesList__element">Nombre de bots</div>
      <div class="gamesList__element">Joueurs dans la partie</div>
      <div class="gamesList__element">Action</div>
    </div>
    
    <div v-for="game in games" :key="game.idGame"  class="gamesList__container games">
      <div class="gamesList__element">{{game.idGame}}</div>
      <div class="gamesList__element gamesList__started" :class="!game.started?'gamesList__started--true':'gamesList__started--false'"></div>
      <div class="gamesList__element">{{game.countPlayers}} </div>
      <div class="gamesList__element">{{game.countBots}} </div>
      <div class="gamesList__element">
        <div v-for="player in game.players" :key="player.name">
          {{player.name}} {{player.name == game.leader}}
        </div>
      </div>
      <div class="gamesList__container">
        <button class="gamesList__element" v-show="game.players && ((!game.started && game.players.length < game.countPlayers) || game.players.filter((p)=>p.name == name).length)" 
          @click="joinGame(game.idGame)">joindre</button>
      </div>
    </div>
    <div v-if="!games || (games && !games.length)">
      Aucune partie
    </div>

    <el-dialog
      title="Options de partie"
      :visible.sync="dialogVisible"
      >
      Nombre de joueur <input type="number" v-model="countPlayers" name="quantity" min="1" :max="4-countBots">
      Nombre de bots <input type="number" v-model="countBots" name="quantity" :min="0" :max="countPlayers?4-countPlayers:3-countPlayers"> bot(s)
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Annuler</el-button>
        <el-button type="primary" @click="createGame();dialogVisible = false">Confirmer</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { HTTP } from '../axios-wrapper' 
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('user')

export default {
  name: 'ListeParties',
  data: function () {
    return {
      games: [], 
      countPlayers: 2,
      countBots: 0,
      dialogVisible: false,
      onMessagefnID: undefined
    }
  },
  computed: {
    ...mapGetters({
      name: 'getName',
    })
  },
  
  methods: {
    async createGame(){ 
      /* eslint-disable no-console */
      let {data: idGame} = await HTTP.post('/game',{countPlayers:parseInt(this.countPlayers)+parseInt(this.countBots),countBots:this.countBots})
      this.joinGame(idGame)
    },
    async listGames(idGame=undefined){
      let {data} = await HTTP.get(`/game${idGame?'/'+idGame:''}`)
      if (data instanceof Array) this.games.push(...data)
      else this.games = [...this.games,data]
    },
    async joinGame(idGame){
      await HTTP.post(`/game/join/${idGame}`)
      this.$router.push({ name: 'game', params: { idGame } })
    }
  },
  async created(){
    await this.listGames()
    this.onMessagefnID = await this.$store.dispatch('WS/add_fn', {
        fn: async (message) => {
          if (message.action.newGame) {
            //this.games = message.games
            this.listGames(message.action.newGame)
          }
        } 
      })
  },
  destroyed () {
    this.$store.commit('WS/remove_fn', this.onMessagefnID)
  },
}
</script>
