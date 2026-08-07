let tokenNumber = 1;

function bookToken() {

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value;
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

    document.getElementById("customerAge").textContent =
    "उम्र: " + age + " वर्ष";

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

    const token = document.getElementById("tokenNumber").innerText;
    const name = document.getElementById("customerName").innerText;
    const service = document.getElementById("customerService").innerText;
    const date = document.getElementById("customerDate").innerText;
    const time = document.getElementById("customerTime").innerText;

    const slip = `
आधार सेवा केन्द्र कंजौली
आईटी केंद्र कंजौली
तहसील - बालघाट, जिला - करौली (राजस्थान)

============================

${token}

${name}
${service}
${date}
${time}

कृपया निर्धारित समय पर केन्द्र पर आएं।

============================
`;

    const blob = new Blob([slip], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Aadhar-Token-Slip.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(function() {
        URL.revokeObjectURL(url);
    }, 1000);
}
