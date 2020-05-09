// This code runs as soon as the page is loaded, when 
// the script tag in the HTML file is executed. 

// It sends a GET request for the JSON file postcardData.json 

getPostcardFromServer(); 
function getPostcardFromServer(){
  let url = "/getPostcard?id="
  var urlParams = new URLSearchParams(window.location.search);
  
  let randString = urlParams.toString().substring(3);
  url = url + randString;
  // console.log(url);
  let xhr = new XMLHttpRequest;
  xhr.open("GET", url)
  xhr.addEventListener("load", function() {
    if(xhr.status == 200) {
      let responseStr = xhr.responseText;
      console.log(responseStr);
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



