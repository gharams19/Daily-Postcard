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

//UPLOAD IMAGE
function sendImg(data) {
  console.log("sending img");

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload", true);
  xhr.setRequestHeader("Content-Type", "multipart/form-data");
  xhr.onreadystatechange = () => {
    if (this.readyState === XMLHttpRequest.DONE && this.status == 200) {
    }
  };
}

document.querySelector("#image form").addEventListener("submit", () => {
  console.log(document.querySelector('#imgUpload'));
  return false;
});
