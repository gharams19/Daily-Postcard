"use strict";

function openUrl() {
  location.href = document.getElementById("popup_url").innerHTML;
}
function on() {
  document.getElementById("overlay").style.display = "block";
}

function off() {
  document.getElementById("overlay").style.display = "none";
}
// Unicode characters we will use
const diamond = "\u27e1";
const cross = "\u2756";

// querySelector returns the first element that matches the
// given CSS selector; in this case, the first span with id "fonts"
let currentFontIcon = document.querySelector("#fonts span");

// add event listeners
document.querySelectorAll("#fonts input").forEach(i => {
  // if status of one button changes, this will be called
  i.addEventListener("change", () => {
    // because these are radio buttons, i.checked is true for
    // the one selected
    if (i.checked) {
      console.log("checked");
      // change diamonds
      // put the crossed diamond in front of this choice
      i.previousElementSibling.textContent = cross;
      // put the regular diamond in front of the last choice
      currentFontIcon.textContent = diamond;
      // and remember that this is the current choice
      currentFontIcon = i.previousElementSibling;

      document.querySelector("#message").className = i.value;
    }
  });
});

//CHANGE COLOR

const colors = [
  "#e6e2cf",
  "#dbcaac",
  "#c9cbb3",
  "#bbc9ca",
  "#A6A5B5",
  "#B5A6AB",
  "#ECCFCF",
  "#eceeeb",
  "#BAB9B5"
];

// querySelectorAll returns a list of all the elements with class color-box
const colorBoxes = document.querySelectorAll(".color-box");

colorBoxes.item(0).style.border = "1px solid black";
let currentColor = colorBoxes.item(0);

colorBoxes.forEach((b, i) => {
  b.style.backgroundColor = colors[i];

  b.addEventListener("click", () => {
    // colorBoxes.forEach((d) => {
    //   d.style.border = 'none';
    // })
    currentColor.style.border = "none";
    b.style.border = "1px solid black";
    document.querySelector(".postcard").style.backgroundColor = colors[i];
    currentColor = b;
  });

  b.addEventListener("mouseover", () => {
    b.style.border = "1px dashed black";
    document.querySelector(".postcard").style.backgroundColor = colors[i];
  });
  b.addEventListener("mouseout", () => {
    if (b != currentColor) {
      b.style.border = "none";
      document.querySelector(".postcard").style.backgroundColor =
        currentColor.style.backgroundColor;
    } else {
      b.style.border = "1px solid black";
    }
  });
});

// UPLOAD postcard data
// When the user hits the button...

function SharePostcard() {
  on();
  var xhr = new XMLHttpRequest();
  var url = "/newPostcard";

  // open a connection
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  let message = document.querySelector("#message");
  let img = document.getElementById("cardImg");
  // let img = document.querySelector('#cardImg');
  let backgroundColor = currentColor.style.backgroundColor;
  let fontFamily;
  if (message.className == "flower") {
    fontFamily = "Indie Flower";
  } else if (message.className == "script") {
    fontFamily = "Dancing Script";
  } else if (message.className == "cang") {
    fontFamily = "Long Cang";
  } else {
    fontFamily = "Homemade Apple";
  }

  var data = {
    message: message.innerText,
    image: img.src,
    color: backgroundColor,
    font: fontFamily
  };
  xhr.addEventListener("load", function() {
    let r = xhr.responseText;
    let popupUrl =
      "https://alike-grand-microwave.glitch.me/display.html?id=" + r;
    document.getElementById("popup_url").innerHTML = popupUrl;
  });
  // Sending data with the request

  xhr.send(JSON.stringify(data));
}

// UPLOAD IMAGE
document.querySelector("#imgUpload").addEventListener("change", () => {
  // get the file with the file dialog box
  const selectedFile = document.querySelector("#imgUpload").files[0];
  // store it in a FormData object
  const formData = new FormData();
  formData.append("newImage", selectedFile, selectedFile.name);

  let button = document.querySelector(".btn");

  // build an HTTP request data structure
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload", true);
  xhr.onloadend = function(e) {
    // Get the server's response to the upload
    console.log(xhr.responseText);
    let newImage = document.querySelector("#cardImg");
    newImage.src = "../images/" + selectedFile.name;
    newImage.style.display = "block";
    document.querySelector(".image").classList.remove("upload");
    button.textContent = "Replace Image";
  };

  button.textContent = "Uploading...";
  // actually send the request
  let imageUploaded = document.querySelector("#cardImg");
  imageUploaded.src = "../images/" + selectedFile.name;

  xhr.send(formData);
  sendImage(imageUploaded.src);
});

function sendImage(imageName) {
  let xhr = new XMLHttpRequest();
  // it's a GET request, it goes to URL /seneUploadToAPI
  
  xhr.open("POST", "/sendUploadToAPI");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");


  // Add an event listener for when the HTTP response is loaded
  xhr.addEventListener("load", function() {
    if (xhr.status == 200) {
      // success
      console.log("succes!", xhr.responseText);
    } else {
      // failure
      console.log("failure!", xhr.responseText);
    }
  });

  var imageFile = {
    "image": imageName
  }
  // Actually send request to server
  xhr.send(JSON.stringify(imageFile));
}
