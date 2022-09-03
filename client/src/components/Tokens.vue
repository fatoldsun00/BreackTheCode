<template>
  <div class="tokens">
    <div v-for="(token,index) in tokens" :key="index" class="tokens__container">
      <div :data-tokenVal="token.val" class="tokens__token" :class="'tokens__token--'+token.col + ' ' +'tokens__token--'+token.val">
        {{token.val}}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Tokens',
  data: function () {
    return {
     
    }
  },

  props: {
    tokens: Array
  },
  methods: {
    
  },
  created(){

  }

}
</script>
