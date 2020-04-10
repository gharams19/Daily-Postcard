"use strict";

const colors = [
  '#e6e2cf',
  '#dbcaac',
  '#c9cbb3',
  '#bbc9ca',
  '#A6A5B5',
  '#B5A6AB',
  '#ECCFCF',
  '#eceeeb',
  '#BAB9B5',
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

const colorBoxes = document.querySelectorAll('.color-box')

colorBoxes.forEach((b, i) => {
  b.style.backgroundColor = colors[i];
  b.addEventListener('click', () => {
    colorBoxes.forEach((b) => {
      b.style.border = 'none';
    })
    
  })
})