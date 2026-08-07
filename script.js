let tokenNumber = 1;

function bookToken() {

let name = document.getElementById("name").value;
let service = document.getElementById("service").value;

if(name === ""){
alert("कृपया अपना नाम लिखें");
return;
}

let token = "A-" + String(tokenNumber).padStart(3,'0');

document.getElementById("tokenSlip").style.display = "block";

document.getElementById("tokenNumber").innerHTML =
"टोकन नंबर: " + token;

document.getElementById("customerName").innerHTML =
"नाम: " + name;

document.getElementById("customerService").innerHTML =
"सेवा: " + service;

tokenNumber++;

}
