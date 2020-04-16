let xhr = new XMLHttpRequest();

xhr.open("GET", '/display.json');
xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xhr.onloadend = function(e) {
  console.log(xhr.responseText);
  let data = JSON.parse(xhr.responseText);
  console.log(data);
  let postcardImage = document.getElementById("cardImg");
  postcardImage.style.display = 'block';
  postcardImage.src = data.image;
  let postcardMessage = document.getElementById("message");
  postcardMessage.textContent = data.message;
  postcardMessage.className = data.font;
  document.querySelector(".postcard").style.backgroundColor = data.color;
}

xhr.send(null);

