"use strict";

document.querySelectorAll('#fonts input').forEach((i) => {
  i.addEventListener('change', () => {
    console.log(i);
    if(i.checked) {
      console.log('checked');
      document.querySelector('#message').className = i.value;
    }
  })
})