// This code runs as soon as the page is loaded, when 
// the script tag in the HTML file is executed. 

// It sends a GET request for the JSON file postcardData.json 

// let xhr = new XMLHttpRequest();

// xhr.open("GET", 'postcardData.json');
// xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

// // set up callback function that will run when the HTTP response comes back
// xhr.onloadend = function(e) {
//   console.log(xhr.responseText);
  
//   // responseText is a string
//   let data = JSON.parse(xhr.responseText);
  
//   // get the postcard data out of the object "data" and 
//   // configure the postcard
//   let postcardImage = document.getElementById("cardImg");
//   postcardImage.style.display = 'block';
//   postcardImage.src = data.image;
//   let postcardMessage = document.getElementById("message");
//   //postcardMessage.textContent = data.message;
//   // textContent throws away newlines; so use innerText instead
//   postcardMessage.innerText = data.message; 
//   postcardMessage.className = data.font;
//   document.querySelector(".postcard").style.backgroundColor = data.color;
getPostcardFromServer(); 
function getPostcardFromServer(){
  let url = "/getPostcard?id="
  let randString =  .getElementById("r").innerHTML;
  url = url + randString;
  // console.log(url);
  let xhr = new XMLHttpRequest;
  xhr.open("GET", url)
  xhr.addEventListener("load", function() {
    if(xhr.status == 200) {
      let responseStr = xhr.responseText;
      // console.log(responseStr);
      let postcardTable = JSON.parse(responseStr);
      document.getElementById("Dmessage").innerText = postcardTable.message;
      document.getElementById("DcardImg").src = postcardTable.image;
      document.querySelector(".Dpostcard").style.backgroundColor = postcardTable.color;
      document.getElementById("Dmessage").fontFamily = postcardTable.font;
    }
    else {
      console.log("Error fetching table");
      console.log(xhr.responseText);
    }
  });
  xhr.send();
}



