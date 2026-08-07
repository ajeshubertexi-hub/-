let tokenNumber = 1;

function bookToken() {

    const name = document.getElementById("name").value.trim();
    const service = document.getElementById("service").value;
    const timeSlot = document.getElementById("timeSlot").value;

    if (name === "") {
        alert("कृपया अपना नाम लिखें।");
        return;
    }

    const token = "A-" + String(tokenNumber).padStart(3, "0");

    document.getElementById("tokenNumber").textContent =
        "टोकन नंबर: " + token;

    document.getElementById("customerName").textContent =
        "नाम: " + name;

    document.getElementById("customerService").textContent =
        "सेवा: " + service;

    document.getElementById("customerTime").textContent =
        "समय: " + timeSlot;

    document.getElementById("tokenSlip").style.display = "block";

    tokenNumber++;
}
