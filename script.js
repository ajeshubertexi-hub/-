let tokenNumber = 1;

function bookToken() {
    let name = document.getElementById("name").value;
    let service = document.getElementById("service").value;
    
    if(name === "") {
        alert("कृपया अपना नाम लिखें");
        return;
    }

    let token = "A-" + String(tokenNumber).padStart(3, '0');

    alert(
        "टोकन बुक हो गया!\n\n" +
        "नाम: " + name +
        "\nसेवा: " + service +
        "\nटोकन नंबर: " + token
    );

    tokenNumber++;
}
