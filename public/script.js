"use strict";

const colors = [
  '#e6e2cf',
  '#B5A6AB',
  '#ECCFCF',
  '#A6A5B5',
  '#BAB9B5',
  '#c9cbb3',
  '#dbcaac',
  '#bbc9ca',
  '#eceeeb'
]

document.querySelectorAll('#fonts input').forEach((i) => {
  i.addEventListener('change', () => {
    console.log(i);
    if(i.checked) {
      console.log('checked');
      document.querySelector('#message').className = i.value;
    }
  })
})