<template>
  <div @click="actifCard?false:$emit('update:cardDisplay',card.id )" class="card" :class="{['card--display']: cardToDisplay}">
    <div class="card__body" v-html="label"></div>
       
    <div v-if="cardToDisplay">
      <div v-if="actifCard && !isActifPlayer">
 
        <div v-if="card.typeResponse=='Number'">
          <input type="input" class="card__repNumber" v-model="response" 
              @keyup.enter="$emit('card:responseToCard',{response})" placeholder="Response" />
        </div>
             
        <div v-if="card.typeResponse=='Array' || card.typeResponse=='MultiArray'">
          <div v-for="index of Array(5).keys()" :key="index" 
              :class="responseArray.indexOf(index) > -1?'card__repArray--in':'card__repArray--out'" 
              @click="pushArrayResponse(index)">
            {{String.fromCharCode('A'.charCodeAt(0) + index)}}
          </div>
        </div>
        <div v-if="card.typeResponse=='Boolean'">
          <input type="checkbox" class="card__repBoolean" v-model="response" />
        </div>
        <button class="card_button icon icon--valider" @click.stop="responseToCard()"></button>
      </div>
      <div v-else>
        <button class="card_button icon icon--valider" @click.stop="pickupCard()"></button>
        <button class="card_button icon icon--annuler"></button>
        <button class="card_button icon icon--precedent" @click.stop="$emit('card:previous')"></button>
        <button class="card_button icon icon--suivant" @click.stop="$emit('card:next')"></button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Cartes',
  data: function () {
    return {
      response: (this.card.typeResponse=="Array"? [] : (this.card.typeResponse=="Boolean"? false : undefined)),
      responseArray: []
    }
  },
  computed: {
    cardToDisplay() {
      return this.cardDisplay==this.card.id || this.actifCard==this.card.id
    },
    label() {
      if (this.card.choice){
        return this.card.label.replace(this.card.choice, '<strong style="color:red">'+this.card.choice+'</strong>' )
      }
      return this.card.label
    }
  },
  props: {
    card: Object,
    cardDisplay:Number,
    actifCard: Number,
    isActifPlayer: Boolean
  },
  methods: {
    pickupCard() {
      if (this.card.choice) {
        this.$prompt('Choix', 'Choisisez entre '+this.card.choice.join(' et '), {
          confirmButtonText: 'OK',
          cancelButtonText: 'Annuler',
          inputPattern: /[0-9]/,
          inputErrorMessage: 'Numérique attendu'
        }).then(({ value }) => {
          this.$emit('card:pickupCard',{id:this.card.id,choice:parseInt(value)})
        }).catch(() => {
          
        });
      } else {
        this.$emit('card:pickupCard',{id:this.card.id})
      }
    },
    responseToCard() {
      //MultiArray : decoupage
      if (this.card.typeResponse=='MultiArray') {
        let groupArr = []
        let groupTemp = []
        //Sort Asc
        this.responseArray = this.responseArray.sort(function(a, b){return a-b});
        console.log(this.responseArray)
        for (let i of Array(5).keys()) {
          i = parseInt(i)
          console.log(this.responseArray[i+1] , this.responseArray[i] , this.responseArray[i+1]-1);
          if (this.responseArray[i] && this.responseArray[i+1] && this.responseArray[i] == this.responseArray[i+1]-1){
            console.log(i);
            groupTemp.push(i)
          } else {
            console.log('pas trouve',i);
            groupTemp.push(i)
            groupArr.push(groupTemp)
            groupTemp=[]
          }
          /*if (this.responseArray[i]) {
            console.log(this.responseArray,this.responseArray[i] , this.responseArray[i+1]);
            if (this.responseArray[i+1] && this.responseArray[i] == this.responseArray[i+1]-1){
              groupTemp.push(i)
            } else{
              //dernier element ?
              console.log(!this.responseArray[i+1] , this.responseArray[i-1] , this.responseArray[i]-1==this.responseArray[i-1]);

              if (!this.responseArray[i+1] && this.responseArray[i-1] && this.responseArray[i]-1==this.responseArray[i-1]){
                groupTemp.push(i)
              }
              groupArr.push(groupTemp)
              groupTemp=[]
            }
          } else {
            groupArr.push([i])
          }*/
          
        }
        console.log(groupArr)
        this.responseArray=[]
        return

      }

      if (this.card.typeResponse == "Array") {
        this.response = this.responseArray
        this.responseArray=[]
      }

      this.$emit('card:responseToCard',{response:this.response})
    },

    pushArrayResponse(i) {
      if (this.responseArray.indexOf(i) < 0 ) {
        this.responseArray.push(i)
      } else {
        this.responseArray.splice(this.responseArray.indexOf(i),1)
      }
    }
  }
}
</script>
