<template>
  <div class="players">
    <div class="players__player" :class="{['players__player--leader']:player.name == leader,['players__player--actif']:player.name == actifPlayer}"
      v-for="player in players" :key="player.name" @click="selectplayer()">{{player.name}}
    </div> 
  </div>
</template>

<script>

export default {
  name: 'Players',
  data: function () {
    return {
     
    }
  },
  props: { 
    players: Array, 
    name:String,
    actifPlayer:String,
    leader: String
  },
  methods: {
    selectplayer(){
      
    }
  },
  created(){

  }

}
</script>
