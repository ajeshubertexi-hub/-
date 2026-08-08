import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getDatabase,
    ref,
    runTransaction,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyAlxyXSuofz3aqDzVQfs9zmussSCUxjRpY",
    authDomain: "aadhar-seva-kendra-kanjouli.firebaseapp.com",
    databaseURL: "https://aadhar-seva-kendra-kanjouli-default-rtdb.firebaseio.com",
    projectId: "aadhar-seva-kendra-kanjouli",
    storageBucket: "aadhar-seva-kendra-kanjouli.firebasestorage.app",
    messagingSenderId: "599391603428",
    appId: "1:599391603428:web:6a62ac51b4cd75a8513af1",
    measurementId: "G-PLY1V10ZQW"
};


// Firebase शुरू करें
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


// आज की तारीख
function getToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// Token बुक करें
async function bookToken() {

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


    // Validation
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


    try {

        /*
        चुनी गई तारीख के लिए
        अलग Token Counter बनाया जाएगा।
        */

        const counterRef =
            ref(database, "tokenCounters/" + date);


        const result =
            await runTransaction(counterRef, (currentValue) => {

                if (currentValue === null) {
                    return 1;
                }

                return currentValue + 1;

            });


        if (!result.committed) {

            alert("Token बनाने में समस्या हुई।");
            return;

        }


        const tokenNumber =
            result.snapshot.val();


        const token =
            "A-" + String(tokenNumber).padStart(3, "0");


        // Booking की जानकारी
        const booking = {

            token: token,

            tokenNumber: tokenNumber,

            name: name,

            age: Number(age),

            service: service,

            date: date,

            time: time,

            bookingCreatedAt:
                new Date().toISOString()

        };


        // Firebase में नई booking
        const bookingRef =
            push(ref(database, "bookings"));


        await set(bookingRef, booking);


        // पर्ची पर जानकारी दिखाएँ

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


        alert(
            "Booking सफलतापूर्वक Firebase में सेव हो गई।\n\n" +
            "आपका Token Number: " + token
        );


        // Form साफ करें
        document.getElementById("name").value = "";
        document.getElementById("age").value = "";


    } catch (error) {

        console.error("Firebase Error:", error);

        alert(
            "Booking सेव नहीं हुई।\n\n" +
            "कृपया Firebase Database Rules और इंटरनेट कनेक्शन जाँचें।"
        );

    }

}


// PDF Download
async function downloadTokenSlip() {

    const pdfContent =
        document.getElementById("pdfContent");


    if (!pdfContent) {

        alert("टोकन पर्ची नहीं मिली।");
        return;

    }


    if (typeof html2pdf === "undefined") {

        alert(
            "PDF सिस्टम लोड नहीं हुआ। " +
            "इंटरनेट चालू करके दोबारा प्रयास करें।"
        );

        return;

    }


    const oldDisplay =
        pdfContent.style.display;

    const oldVisibility =
        pdfContent.style.visibility;


    pdfContent.style.display = "block";

    pdfContent.style.visibility = "visible";

    pdfContent.style.background = "#ffffff";

    pdfContent.style.color = "#000000";

    pdfContent.style.fontFamily =
        '"Noto Sans Devanagari", Arial, sans-serif';

    pdfContent.style.padding = "20px";


    if (document.fonts && document.fonts.ready) {

        await document.fonts.ready;

    }


    const options = {

        margin: 10,

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


    try {

        await html2pdf()
            .set(options)
            .from(pdfContent)
            .save();


    } catch (error) {

        console.error(error);

        alert(
            "PDF डाउनलोड करने में समस्या हुई।"
        );

    }


    pdfContent.style.display =
        oldDisplay;

    pdfContent.style.visibility =
        oldVisibility;

}


// HTML button के लिए functions उपलब्ध करें
window.bookToken = bookToken;

window.downloadTokenSlip =
    downloadTokenSlip;
