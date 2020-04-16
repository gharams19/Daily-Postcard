const data = require('./data.json');

let postcardImage = document.getElementById("cardImage");
postcardImage.src = data.image;
let postcardMessage = document.getElementById("message");
postcardMessage.textContent = data.message;
postcardMessage.className = data.font;
document.querySelector(".postcard").style.backgroundColor = data.color;
