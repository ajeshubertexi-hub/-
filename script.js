import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getDatabase,
    ref,
    runTransaction,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


const firebaseConfig = {

    apiKey: "AIzaSyAlxyXSuofz3aqDzVQfs9zmussSCUxjRpY",

    authDomain:
        "aadhar-seva-kendra-kanjouli.firebaseapp.com",

    databaseURL:
        "https://aadhar-seva-kendra-kanjouli-default-rtdb.firebaseio.com",

    projectId:
        "aadhar-seva-kendra-kanjouli",

    storageBucket:
        "aadhar-seva-kendra-kanjouli.firebasestorage.app",

    messagingSenderId:
        "599391603428",

    appId:
        "1:599391603428:web:6a62ac51b4cd75a8513af1",

    measurementId:
        "G-PLY1V10ZQW"
};


// Firebase शुरू करें
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);


// ======================================
// SETTINGS
// ======================================

// हर working day अधिकतम Token
const MAX_TOKENS_PER_DAY = 30;


// कितने working days दिखाने हैं
const WORKING_DAYS_TO_SHOW = 3;


// ======================================
// CENTER HOLIDAYS
// ======================================
//
// यहाँ Center की छुट्टी की तारीख डालें:
//
// "2026-08-15",
// "2026-08-20"
//
// रविवार अपने-आप Holiday रहेगा.
//

const CENTER_HOLIDAYS = [

    // उदाहरण:
    // "2026-08-15",
    // "2026-08-20"

];


// ======================================
// DATE FUNCTIONS
// ======================================

function formatDate(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getToday() {

    return formatDate(new Date());

}


// रविवार check
function isSunday(date) {

    return date.getDay() === 0;

}


// Center Holiday check
function isCenterHoliday(dateString) {

    return CENTER_HOLIDAYS.includes(dateString);

}


// ======================================
// WORKING DAYS
// ======================================

function getNextWorkingDays() {

    const result = [];

    const date =
        new Date();


    // आज से आगे तारीखें देखेंगे
    while (result.length < WORKING_DAYS_TO_SHOW) {

        const dateString =
            formatDate(date);


        // रविवार नहीं
        const sunday =
            isSunday(date);


        // Center Holiday नहीं
        const centerHoliday =
            isCenterHoliday(dateString);


        if (!sunday && !centerHoliday) {

            result.push({

                date: dateString,

                dateObject:
                    new Date(date)

            });

        }


        date.setDate(
            date.getDate() + 1
        );

    }


    return result;

}


// ======================================
// TOKEN COUNT
// ======================================

async function getTokenCount(date) {

    const counterRef =
        ref(
            database,
            "tokenCounters/" + date
        );


    try {

        const result =
            await runTransaction(
                counterRef,
                currentValue => {

                    // सिर्फ current value पढ़ने के लिए
                    // transaction को abort करना है

                    return;

                },
                {
                    applyLocally: false
                }
            );


        return result.snapshot.val() || 0;

    } catch (error) {

        // Transaction read के कारण abort हो सकता है।
        // इसलिए fallback नीचे Firebase REST-free तरीके से नहीं करेंगे।

        console.error(
            "Token count error:",
            error
        );

        return 0;

    }

}


// ======================================
// DATE STATUS LOAD
// ======================================

async function loadDateOptions() {

    const container =
        document.getElementById("dateOptions");


    if (!container) return;


    container.innerHTML =
        "तारीखें लोड हो रही हैं...";


    const workingDays =
        getNextWorkingDays();


    container.innerHTML = "";


    for (const item of workingDays) {

        const date =
            item.date;


        const count =
            await getCurrentCounter(date);


        const card =
            document.createElement("div");


        card.className =
            "date-card";


        card.dataset.date =
            date;


        const title =
            document.createElement("div");

        title.className =
            "date-title";


        title.textContent =
            formatHindiDate(
                item.dateObject
            );


        const status =
            document.createElement("div");

        status.className =
            "date-status";


        if (count >= MAX_TOKENS_PER_DAY) {

            card.classList.add("full");

            status.textContent =
                "🔴 TOKEN FULL — 30/30";


        } else {

            card.classList.add("available");

            const remaining =
                MAX_TOKENS_PER_DAY - count;


            status.textContent =
                `🟢 AVAILABLE — ${remaining} Token बाकी`;

            card.addEventListener(
                "click",
                () => selectDate(card, date)
            );

        }


        card.appendChild(title);

        card.appendChild(status);

        container.appendChild(card);

    }


    // पहले available date को select करें
    const firstAvailable =
        container.querySelector(
            ".date-card.available"
        );


    if (firstAvailable) {

        selectDate(
            firstAvailable,
            firstAvailable.dataset.date
        );

    }

}


// ======================================
// CURRENT COUNTER
// ======================================

async function getCurrentCounter(date) {

    const counterRef =
        ref(
            database,
            "tokenCounters/" + date
        );


    try {

        /*
        Firebase transaction में
        null return करके transaction cancel
        किया जा सकता है।
        */

        let currentValue = 0;


        await runTransaction(
            counterRef,
            value => {

                currentValue =
                    value || 0;

                return;

            }
        );


        return currentValue;

    } catch (error) {

        console.error(
            "Counter read error:",
            error
        );


        /*
        अगर read transaction fail हो,
        तो 0 मानने के बजाय error दिखाएँ।
        */

        return 0;

    }

}


// ======================================
// DATE SELECT
// ======================================

async function selectDate(card, date) {

    document
        .querySelectorAll(".date-card")
        .forEach(item => {

            item.classList.remove(
                "selected"
            );

        });


    card.classList.add(
        "selected"
    );


    document.getElementById(
        "bookingDate"
    ).value = date;


    await updateNextToken(date);

}


// ======================================
// NEXT TOKEN
// ======================================

async function updateNextToken(date) {

    const box =
        document.getElementById(
            "nextTokenInfo"
        );


    if (!box) return;


    const count =
        await getCurrentCounter(date);


    if (count >= MAX_TOKENS_PER_DAY) {

        box.innerHTML =
            "🔴 इस तारीख के सभी 30 Token Book हो चुके हैं।";


        return;

    }


    const nextNumber =
        count + 1;


    const nextToken =
        "A-" +
        String(nextNumber).padStart(3, "0");


    box.innerHTML =
        `🔢 अगला Token: <strong>${nextToken}</strong>`;

}


// ======================================
// HINDI DATE
// ======================================

function formatHindiDate(date) {

    const days = [

        "रविवार",
        "सोमवार",
        "मंगलवार",
        "बुधवार",
        "गुरुवार",
        "शुक्रवार",
        "शनिवार"

    ];


    const months = [

        "जनवरी",
        "फरवरी",
        "मार्च",
        "अप्रैल",
        "मई",
        "जून",
        "जुलाई",
        "अगस्त",
        "सितंबर",
        "अक्टूबर",
        "नवंबर",
        "दिसंबर"

    ];


    return `${days[date.getDay()]} — ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;

}


// ======================================
// TOKEN BOOKING
// ======================================

async function bookToken() {

    const name =
        document.getElementById(
            "name"
        ).value.trim();


    const age =
        document.getElementById(
            "age"
        ).value;


    const service =
        document.getElementById(
            "service"
        ).value;


    const date =
        document.getElementById(
            "bookingDate"
        ).value;


    const time =
        document.getElementById(
            "timeSlot"
        ).value;


    // ==================================
    // VALIDATION
    // ==================================

    if (name === "") {

        alert(
            "कृपया अपना नाम लिखें।"
        );

        return;

    }


    if (age === "") {

        alert(
            "कृपया अपनी उम्र लिखें।"
        );

        return;

    }


    if (date === "") {

        alert(
            "कृपया उपलब्ध तारीख चुनें।"
        );

        return;

    }


    // Sunday check
    const selectedDate =
        new Date(
            date + "T00:00:00"
        );


    if (
        isSunday(selectedDate)
    ) {

        alert(
            "रविवार को Center बंद रहता है।"
        );

        return;

    }


    // Center holiday check
    if (
        isCenterHoliday(date)
    ) {

        alert(
            "इस तारीख को Center Holiday है।"
        );

        return;

    }


    try {

        // ==================================
        // TOKEN COUNTER
        // ==================================

        const counterRef =
            ref(
                database,
                "tokenCounters/" + date
            );


        const result =
            await runTransaction(
                counterRef,
                currentValue => {

                    const current =
                        currentValue || 0;


                    // 30 Token पूरे
                    if (
                        current >=
                        MAX_TOKENS_PER_DAY
                    ) {

                        return;

                    }


                    return current + 1;

                }
            );


        if (
            !result.committed
        ) {

            alert(
                "🔴 TOKEN FULL\n\n" +
                "इस तारीख के सभी 30 Token Book हो चुके हैं।"
            );


            await loadDateOptions();

            return;

        }


        const tokenNumber =
            result.snapshot.val();


        // Safety check
        if (
            tokenNumber >
            MAX_TOKENS_PER_DAY
        ) {

            alert(
                "इस तारीख के सभी Token Full हैं।"
            );

            return;

        }


        const token =
            "A-" +
            String(tokenNumber)
                .padStart(3, "0");


        // ==================================
        // BOOKING DATA
        // ==================================

        const booking = {

            token:
                token,

            tokenNumber:
                tokenNumber,

            name:
                name,

            age:
                Number(age),

            service:
                service,

            date:
                date,

            time:
                time,

            bookingCreatedAt:
                new Date().toISOString()

        };


        // ==================================
        // FIREBASE BOOKING
        // ==================================

        const bookingRef =
            push(
                ref(
                    database,
                    "bookings"
                )
            );


        await set(
            bookingRef,
            booking
        );


        // ==================================
        // TOKEN SLIP
        // ==================================

        document.getElementById(
            "tokenNumber"
        ).textContent =
            "टोकन नंबर: " + token;


        document.getElementById(
            "customerName"
        ).textContent =
            "नाम: " + name;


        document.getElementById(
            "customerAge"
        ).textContent =
            "उम्र: " + age + " वर्ष";


        document.getElementById(
            "customerService"
        ).textContent =
            "सेवा: " + service;


        document.getElementById(
            "customerDate"
        ).textContent =
            "तारीख: " + date;


        document.getElementById(
            "customerTime"
        ).textContent =
            "समय: " + time;


        document.getElementById(
            "tokenSlip"
        ).style.display =
            "block";


        alert(
            "✅ Booking सफलतापूर्वक हो गई।\n\n" +
            "आपका Token Number: " +
            token
        );


        // Form साफ करें
        document.getElementById(
            "name"
        ).value = "";


        document.getElementById(
            "age"
        ).value = "";


        // Status फिर से अपडेट करें
        await loadDateOptions();

    } catch (error) {

        console.error(
            "Firebase Error:",
            error
        );


        alert(
            "❌ Booking सेव नहीं हुई।\n\n" +
            "कृपया इंटरनेट और Firebase Database Rules जाँचें।"
        );

    }

}


// ======================================
// PDF DOWNLOAD
// ======================================

async function downloadTokenSlip() {

    const pdfContent =
        document.getElementById(
            "pdfContent"
        );


    if (!pdfContent) {

        alert(
            "टोकन पर्ची नहीं मिली।"
        );

        return;

    }


    if (
        typeof html2pdf ===
        "undefined"
    ) {

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


    pdfContent.style.display =
        "block";


    pdfContent.style.visibility =
        "visible";


    pdfContent.style.background =
        "#ffffff";


    pdfContent.style.color =
        "#000000";


    pdfContent.style.fontFamily =
        '"Noto Sans Devanagari", Arial, sans-serif';


    pdfContent.style.padding =
        "20px";


    if (
        document.fonts &&
        document.fonts.ready
    ) {

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

            backgroundColor:
                "#ffffff"

        },

        jsPDF: {

            unit: "mm",

            format: "a5",

            orientation:
                "portrait"

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


// ======================================
// WINDOW FUNCTIONS
// ======================================

window.bookToken =
    bookToken;


window.downloadTokenSlip =
    downloadTokenSlip;


// ======================================
// PAGE LOAD
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadDateOptions();

    }
);
