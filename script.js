let tokenNumber = 1;


function bookToken() {

    const name =
        document.getElementById("name").value.trim();

    const age =
        document.getElementById("age").value;

    const service =
        document.getElementById("service").value;

    const date =
        document.getElementById("bookingDate").value;

    const time =
        document.getElementById("timeSlot").value;


    if (name === "") {

        alert("कृपया अपना नाम लिखें।");

        return;
    }


    if (age === "") {

        alert("कृपया अपनी उम्र लिखें।");

        return;
    }


    if (date === "") {

        alert("कृपया तारीख चुनें।");

        return;
    }


    const token =
        "A-" +
        String(tokenNumber).padStart(3, "0");


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


    document.getElementById("tokenSlip").style.display =
        "block";


    tokenNumber++;

}



async function downloadTokenSlip() {

    const pdfContent =
        document.getElementById("pdfContent");


    if (!pdfContent) {

        alert("टोकन पर्ची नहीं मिली।");

        return;
    }


    if (typeof html2pdf === "undefined") {

        alert(
            "PDF सिस्टम लोड नहीं हुआ। इंटरनेट चालू करके दोबारा प्रयास करें।"
        );

        return;
    }


    if (document.fonts && document.fonts.ready) {

        await document.fonts.ready;

    }


    const options = {

        margin: 8,

        filename:
            "Aadhar-Seva-Kendra-Kanjouli-Token.pdf",

        image: {

            type: "jpeg",

            quality: 1

        },

        html2canvas: {

            scale: 3,

            useCORS: true,

            backgroundColor: "#ffffff"

        },

        jsPDF: {

            unit: "mm",

            format: "a5",

            orientation: "portrait"

        }

    };


    html2pdf()

        .set(options)

        .from(pdfContent)

        .save();

}
