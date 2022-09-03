<template>
  <el-dialog title="Résultat" :visible.sync="visible" class="resultGame">
    gagnant{{game.winners?(game.winners.length?'s':''):null}} :  {{game.winners?game.winners.join():null}}
     <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">Fermer</el-button>
      </span>
  </el-dialog>
</template>

<script>

/* eslint-disable no-console */
import { HTTP } from '../axios-wrapper' 

export default {
  name: 'resultGame',
  data: function () {
    return {
      game: {}
    }
  },

  props: {
    resultGameVisible: Boolean,
    idGame: String
  },
  computed: {
    visible: {
      get () {
        return this.resultGameVisible
      },
      set(event){
        this.$emit('update:resultGameVisible', event)
      }
    },
  },
  methods: {

  },
  async created(){
   try {
        let { data } = await HTTP.get(`/game/${this.idGame}`)
        this.game = data
      } catch (err) {
         this.$message({
          showClose: false,
          message: err.data.errmsg,
          type: 'error'
        })
      }
  },
}
</script>
