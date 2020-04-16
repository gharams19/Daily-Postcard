"use strict";

//CHANGE FONTS
const diamond = "&#11046;";
const cross = "&#10070;";

let currentFontIcon = document.querySelector("#fonts span");
console.log(currentFontIcon);

document.querySelectorAll("#fonts input").forEach(i => {
  i.addEventListener("change", () => {
    // console.log(i);
    if (i.checked) {
      console.log("checked");
      //change diamonds
      i.previousElementSibling.innerHTML = cross;
      currentFontIcon.innerHTML = diamond;
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

// DISPLAY

document.querySelector('#save').addEventListener('click', () => {
  // document.querySelector('.edit').classList.add('hide');
  // document.querySelector('.image form').classList.add('hide');
  // document.querySelector('#message').removeAttribute("contenteditable"); 
  // document.querySelector('h1').textContent = 'Daily Postcard';
  let msg = document.querySelector('#message');
  let img = document.querySelector('#cardImg');
  let data = {
    image: img.src,
    color: currentColor.style.backgroundColor,
    font: msg.className,
    message: msg.textContent
  }
  console.log(data);
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
  xmlhttp.open("POST", '/saveDisplay');
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.onloadend = function(e) {
    console.log(xmlhttp.responseText);
    window.location = "https://postcard-app.glitch.me/display.html";
  }
  xmlhttp.send(JSON.stringify(data));
})

// UPLOAD IMAGE
document.querySelector('#imgUpload').addEventListener('change', () => {
  
    // get the file with the file dialog box
    const selectedFile = document.querySelector('#imgUpload').files[0];
    // store it in a FormData object
    const formData = new FormData();
    formData.append('newImage',selectedFile, selectedFile.name);
  
    let button = document.querySelector('.btn');

    // build an HTTP request data structure
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);
    xhr.onloadend = function(e) {
        // Get the server's response to the upload
        console.log(xhr.responseText);
        let newImage = document.querySelector("#cardImg");
        newImage.src = "https://postcard-app.glitch.me/images/"+selectedFile.name;
        newImage.style.display = 'block';
        document.querySelector('.image').classList.remove('upload');
        button.textContent = 'Replace Image';
    }
  
    button.textContent = 'Uploading...';
    // actually send the request
    xhr.send(formData);
});

