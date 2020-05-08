
getPostcardFromSever();
function getPostcardFromSever() {
  let url = "/getPostcard"
  let xhr = new XMLHttpRequest;
  xhr.open("GET", url)
  xhr.addEventListener("load", function() {
    if(xhr.status == 200) {
      let responseStr = xhr.responseText;
      console.log(responseStr);
      let postcardTable = JSON.parse(responseStr);
      document.getElementById("message").innerText = postcardTable.message;
      document.getElementById("cardImg").src = postcardTable.image;
      document.querySelector(".postcard").style.backgroundColor = postcardTable.color;
      document.getElementById("message").fontFamily = postcardTable.font;
    }
    else {
      console.log("Error fetching table");
      console.log(xhr.responseText);
    }
  });
  xhr.send();
}



