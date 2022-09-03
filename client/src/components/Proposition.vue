<template>
 <el-dialog title="Proposition" :visible.sync="visible">

      <div v-for="(i,k) in (0,5)" :key="k" class="proposition">
        <div class="proposition__slot">
          {{String.fromCharCode('A'.charCodeAt(0)+k)}}
        </div>
        <div class="proposition__val">
          <input type="number" v-model="proposition[k].val" min="0" :max="9">
        </div>
        <div class="proposition__col">
          <el-radio-group v-model="proposition[k].col">
            <el-radio-button label="white" class="proposition__colCheck proposition__colCheck--white">
              Blanc
            </el-radio-button>
            <el-radio-button label="green" class="proposition__colCheck proposition__colCheck--green" >
              Vert
            </el-radio-button>
            <el-radio-button label="black" class="proposition__colCheck proposition__colCheck--black" >
              Noir
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">Annuler</el-button>
        <el-button type="primary" @click="doProposition();visible = false">Confirmer</el-button>
      </span>
    </el-dialog>
</template>

<script>

/* eslint-disable no-console */
import { HTTP } from '../axios-wrapper' 

export default {
  name: 'proposition',
  data: function () {
    return {
      proposition : [{
        val: null,
        col: null
      },{
        val: null,
        col: null
      },{
        val: null,
        col: null
      },{
        val: null,
        col: null
      },{
        val: null,
        col: null
      }],
      temp: undefined, temp1: undefined
    }
  },

  props: {
    propositionVisible: Boolean,
    idGame: String
  },
  computed: {
    visible: {
      get () {
        return this.propositionVisible
      },
      set(event){
        this.$emit('update:propositionVisible', event)
      }
    },
  },
  methods: {
    async doProposition(){
      try {
        await HTTP.post(`/game/proposition/${this.idGame}`,{propositions:this.proposition})
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
   
  },
}
</script>
