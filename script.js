let tokenNumber = 1;

function bookToken() {

    const name = document.getElementById("name").value.trim();
    const service = document.getElementById("service").value;
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("timeSlot").value;

    if (name === "") {
        alert("कृपया अपना नाम लिखें।");
        return;
    }

    if (date === "") {
        alert("कृपया तारीख चुनें।");
        return;
    }

    const token = "A-" + String(tokenNumber).padStart(3, "0");

    document.getElementById("tokenNumber").textContent =
        "टोकन नंबर: " + token;

    document.getElementById("customerName").textContent =
        "नाम: " + name;

    document.getElementById("customerService").textContent =
        "सेवा: " + service;

    document.getElementById("customerDate").textContent =
        "तारीख: " + date;

    document.getElementById("customerTime").textContent =
        "समय: " + time;

    document.getElementById("tokenSlip").style.display = "block";

    tokenNumber++;
}
function downloadTokenSlip() {

    const slip = document.getElementById("tokenSlip");

    const text =
        "आधार सेवा केन्द्र कंजौली\n" +
        "आईटी केंद्र कंजौली\n" +
        "तहसील - बालघाट, जिला - करौली (राजस्थान)\n\n" +
        document.getElementById("tokenNumber").innerText + "\n" +
        document.getElementById("customerName").innerText + "\n" +
        document.getElementById("customerService").innerText + "\n" +
        document.getElementById("customerDate").innerText + "\n" +
        document.getElementById("customerTime").innerText;

    const blob = new Blob([text], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Aadhar-Token-Slip.txt";

    link.click();

    URL.revokeObjectURL(url);
}
