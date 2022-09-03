/*import Vue from 'vue'

let onClickFN = []

Vue.directive('tongue', {
  
  componentUpdated: (el,binding )=> {

    if (binding.value != binding.oldValue) {
      let display = true
      let classParent = undefined
      if (typeof(binding.value) === "string") {
        classParent=binding.value
      }
      if (typeof(binding.value) === "object") {
        classParent=Object.keys(binding.value)[0]
        if(Object.values(binding.value)[0]) {
          display = true
        } else display = false
      }
      console.log(binding.value)
  
      if (classParent && display) {
        console.log(binding.value)
  
        //Ajout de l'element tongue
        let element = document.createElement("div")
        element.classList.add(classParent+"__tongue")
        element.classList.add("tongue")
  
        //Ajout du listener
        element.addEventListener("click", () => {
          if (el.classList.contains(classParent+"--developpe")) {
            el.classList.remove(classParent+"--developpe")
          } else {
            el.classList.add(classParent+"--developpe")
          }
        });

        el.appendChild(element)
      }
  
      if (!display) {
        let element = el.querySelector('.tongue')
        if (element) {
          

          element.removeChild('.tongue')
        }
  
      }
    }
  },
  unbind: (el) => {
    el.removeChild(el.querySelector('.tongue'))
  }
})

*/