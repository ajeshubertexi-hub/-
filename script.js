// ======================================================
// AADHAAR SEVA KENDRA KANJOULI
// ONLINE TOKEN BOOKING SYSTEM
// COMPLETE SCRIPT.JS
// ======================================================


// ======================================================
// FIREBASE IMPORT
// ======================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


import {
    getDatabase,
    ref,
    runTransaction,
    push,
    set,
    get
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";



// ======================================================
// FIREBASE CONFIGURATION
// ======================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyAlxyXSuofz3aqDzVQfs9zmussSCUxjRpY",

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



// ======================================================
// FIREBASE START
// ======================================================

const app =
    initializeApp(firebaseConfig);


const database =
    getDatabase(app);



// ======================================================
// SETTINGS
// ======================================================

const MAX_TOKENS_PER_DAY = 30;


// अगले कितने दिन दिखाने हैं
const DAYS_TO_SHOW = 7;


// ======================================================
// CENTRE HOLIDAYS
// ======================================================
//
// यहाँ Centre Holiday की तारीख डाल सकते हैं.
//
// Format:
//
// "2026-08-15": "स्वतंत्रता दिवस"
//
// उदाहरण:
//
// const CENTRE_HOLIDAYS = {
//     "2026-08-15": "स्वतंत्रता दिवस",
//     "2026-08-27": "केन्द्र अवकाश"
// };
//
// अभी खाली रखा गया है.
//

const CENTRE_HOLIDAYS = {

    // "2026-08-15": "स्वतंत्रता दिवस",
    // "2026-08-27": "केन्द्र अवकाश"

};



// ======================================================
// TODAY DATE
// ======================================================

function getToday() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}



// ======================================================
// DATE FORMAT
// ======================================================

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const year =
        date.getFullYear();


    return (
        day +
        "/" +
        month +
        "/" +
        year
    );

}



// ======================================================
// HINDI DAY NAME
// ======================================================

function getHindiDay(date) {

    const days = [

        "रविवार",
        "सोमवार",
        "मंगलवार",
        "बुधवार",
        "गुरुवार",
        "शुक्रवार",
        "शनिवार"

    ];


    return days[
        date.getDay()
    ];

}



// ======================================================
// DATE IS SUNDAY?
// ======================================================

function isSunday(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return (
        date.getDay() === 0
    );

}



// ======================================================
// DATE IS CENTRE HOLIDAY?
// ======================================================

function isCentreHoliday(dateString) {

    return Object.prototype.hasOwnProperty.call(
        CENTRE_HOLIDAYS,
        dateString
    );

}



// ======================================================
// GET DATE AFTER N DAYS
// ======================================================

function getDateAfterDays(days) {

    const date =
        new Date();


    date.setHours(
        0,
        0,
        0,
        0
    );


    date.setDate(
        date.getDate() + days
    );


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}



// ======================================================
// CHECK OFF DAY
// ======================================================

function getOffReason(dateString) {

    if (
        isSunday(dateString)
    ) {

        return "रविवार\nCentre OFF";

    }


    if (
        isCentreHoliday(dateString)
    ) {

        return (
            "Centre OFF\n" +
            CENTRE_HOLIDAYS[dateString]
        );

    }


    return null;

}



// ======================================================
// GET TOKEN COUNTER
// ======================================================

async function getTokenCount(dateString) {

    try {

        const counterRef =
            ref(
                database,
                "tokenCounters/" +
                dateString
            );


        const snapshot =
            await get(
                counterRef
            );


        if (
            !snapshot.exists()
        ) {

            return 0;

        }


        const value =
            Number(
                snapshot.val()
            );


        if (
            Number.isNaN(value)
        ) {

            return 0;

        }


        return value;

    } catch (error) {

        console.error(
            "Token count error:",
            error
        );


        return 0;

    }

}



// ======================================================
// GET NEXT TOKEN NUMBER
// ======================================================

async function getNextTokenNumber(
    dateString
) {

    const currentCount =
        await getTokenCount(
            dateString
        );


    return (
        currentCount + 1
    );

}



// ======================================================
// UPDATE NEXT TOKEN DISPLAY
// ======================================================

async function updateNextToken(
    dateString
) {

    const nextTokenElement =
        document.getElementById(
            "nextTokenInfo"
        );


    if (
        !nextTokenElement
    ) {

        return;

    }


    const offReason =
        getOffReason(
            dateString
        );


    if (offReason) {

        nextTokenElement.textContent =
            "OFF";


        nextTokenElement.style.color =
            "#6c7680";


        return;

    }


    const count =
        await getTokenCount(
            dateString
        );


    if (
        count >= MAX_TOKENS_PER_DAY
    ) {

        nextTokenElement.textContent =
            "FULL";


        nextTokenElement.style.color =
            "#d64250";


        return;

    }


    const next =
        count + 1;


    nextTokenElement.textContent =
        "A-" +
        String(next).padStart(
            3,
            "0"
        );


    nextTokenElement.style.color =
        "#087f4d";

}



// ======================================================
// CREATE DATE CARD
// ======================================================

async function createDateCard(
    dateString
) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    const count =
        await getTokenCount(
            dateString
        );


    const offReason =
        getOffReason(
            dateString
        );


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "date-card";


    card.dataset.date =
        dateString;



    // ==================================================
    // OFF
    // ==================================================

    if (offReason) {

        card.classList.add(
            "off"
        );


        card.innerHTML = `

            <div class="date-day">
                ${getHindiDay(date)}
            </div>

            <div class="date-date">
                ${formatDate(dateString)}
            </div>

            <div class="date-status">
                ${offReason}
            </div>

        `;


        return card;

    }



    // ==================================================
    // FULL
    // ==================================================

    if (
        count >= MAX_TOKENS_PER_DAY
    ) {

        card.classList.add(
            "full"
        );


        card.innerHTML = `

            <div class="date-day">
                ${getHindiDay(date)}
            </div>

            <div class="date-date">
                ${formatDate(dateString)}
            </div>

            <div class="date-status">
                🔴 FULL<br>
                30/30 Token
            </div>

        `;


        return card;

    }



    // ==================================================
    // AVAILABLE
    // ==================================================

    card.classList.add(
        "available"
    );


    const remaining =
        MAX_TOKENS_PER_DAY -
        count;


    card.innerHTML = `

        <div class="date-day">
            ${getHindiDay(date)}
        </div>

        <div class="date-date">
            ${formatDate(dateString)}
        </div>

        <div class="date-status">
            🟢 Available<br>
            ${remaining} Token बाकी
        </div>

    `;



    // ==================================================
    // CLICK EVENT
    // ==================================================

    card.addEventListener(
        "click",
        async function () {

            selectDate(
                dateString
            );

        }
    );


    return card;

}



// ======================================================
// LOAD DATE OPTIONS
// ======================================================

async function loadDateOptions() {

    const container =
        document.getElementById(
            "dateOptions"
        );


    if (
        !container
    ) {

        return;

    }


    container.innerHTML = "";


    let firstAvailableDate =
        null;



    // ==================================================
    // SHOW NEXT 7 DAYS
    // ==================================================

    for (
        let i = 0;
        i < DAYS_TO_SHOW;
        i++
    ) {

        const dateString =
            getDateAfterDays(i);


        const card =
            await createDateCard(
                dateString
            );


        container.appendChild(
            card
        );


        // पहले available दिन को याद रखें
        if (
            !firstAvailableDate &&
            card.classList.contains(
                "available"
            )
        ) {

            firstAvailableDate =
                dateString;

        }

    }



    // ==================================================
    // AUTO SELECT AVAILABLE DATE
    // ==================================================

    if (
        firstAvailableDate
    ) {

        selectDate(
            firstAvailableDate
        );

    } else {

        const info =
            document.getElementById(
                "selectedDateInfo"
            );


        if (info) {

            info.textContent =
                "अभी कोई Working Day उपलब्ध नहीं है।";

        }

    }

}



// ======================================================
// SELECT DATE
// ======================================================

async function selectDate(
    dateString
) {

    const offReason =
        getOffReason(
            dateString
        );


    if (offReason) {

        alert(
            "यह तारीख Centre OFF है।"
        );


        return;

    }


    const count =
        await getTokenCount(
            dateString
        );


    if (
        count >= MAX_TOKENS_PER_DAY
    ) {

        alert(
            "इस तारीख के सभी 30 Token पहले ही बुक हो चुके हैं।"
        );


        return;

    }



    // Hidden date input

    const bookingDate =
        document.getElementById(
            "bookingDate"
        );


    if (
        bookingDate
    ) {

        bookingDate.value =
            dateString;

    }



    // Remove old selected

    document
        .querySelectorAll(
            ".date-card"
        )
        .forEach(
            card => {

                card.classList.remove(
                    "selected"
                );

            }
        );



    // Select current

    const selectedCard =
        document.querySelector(
            `.date-card[data-date="${dateString}"]`
        );


    if (
        selectedCard
    ) {

        selectedCard.classList.add(
            "selected"
        );

    }



    // Information

    const info =
        document.getElementById(
            "selectedDateInfo"
        );


    if (
        info
    ) {

        const remaining =
            MAX_TOKENS_PER_DAY -
            count;


        info.innerHTML = `

            📅 चयनित तारीख:
            <strong>
                ${formatDate(dateString)}
            </strong>

            &nbsp; | &nbsp;

            🟢 Available:
            <strong>
                ${remaining}
            </strong>
            Token

        `;

    }



    // Update next token

    await updateNextToken(
        dateString
    );

}



// ======================================================
// BOOK TOKEN
// ======================================================

async function bookToken() {


    const name =
        document
            .getElementById(
                "name"
            )
            .value
            .trim();


    const age =
        document
            .getElementById(
                "age"
            )
            .value;


    const service =
        document
            .getElementById(
                "service"
            )
            .value;


    const date =
        document
            .getElementById(
                "bookingDate"
            )
            .value;


    const time =
        document
            .getElementById(
                "timeSlot"
            )
            .value;



    // ==================================================
    // VALIDATION
    // ==================================================

    if (
        name === ""
    ) {

        alert(
            "कृपया ग्राहक का नाम लिखें।"
        );


        return;

    }



    if (
        age === ""
    ) {

        alert(
            "कृपया उम्र लिखें।"
        );


        return;

    }



    if (
        date === ""
    ) {

        alert(
            "कृपया पहले तारीख चुनें।"
        );


        return;

    }



    // ==================================================
    // SUNDAY / HOLIDAY CHECK
    // ==================================================

    const offReason =
        getOffReason(
            date
        );


    if (
        offReason
    ) {

        alert(
            "इस तारीख को Centre OFF है।"
        );


        await loadDateOptions();


        return;

    }



    try {


        // ==============================================
        // COUNTER REFERENCE
        // ==============================================

        const counterRef =
            ref(
                database,
                "tokenCounters/" +
                date
            );



        // ==============================================
        // IMPORTANT:
        // TRANSACTION ENSURES MAX 30
        // ==============================================

        const result =
            await runTransaction(
                counterRef,
                currentValue => {

                    let current =
                        Number(
                            currentValue
                        );


                    if (
                        Number.isNaN(
                            current
                        )
                    ) {

                        current = 0;

                    }


                    // 30 से अधिक नहीं
                    if (
                        current >=
                        MAX_TOKENS_PER_DAY
                    ) {

                        return;

                    }


                    return current + 1;

                }
            );



        // ==============================================
        // TRANSACTION FAILED
        // ==============================================

        if (
            !result.committed
        ) {

            alert(
                "इस तारीख के सभी 30 Token पहले ही बुक हो चुके हैं।"
            );


            await loadDateOptions();


            return;

        }



        // ==============================================
        // TOKEN NUMBER
        // ==============================================

        const tokenNumber =
            Number(
                result.snapshot.val()
            );


        if (
            tokenNumber >
            MAX_TOKENS_PER_DAY
        ) {

            alert(
                "आज के सभी Token पूरे हो चुके हैं।"
            );


            await loadDateOptions();


            return;

        }



        const token =
            "A-" +
            String(
                tokenNumber
            ).padStart(
                3,
                "0"
            );



        // ==============================================
        // BOOKING OBJECT
        // ==============================================

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



        // ==============================================
        // SAVE BOOKING
        // ==============================================

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



        // ==============================================
        // SHOW TOKEN SLIP
        // ==============================================

        const tokenNumberElement =
            document.getElementById(
                "tokenNumber"
            );


        if (
            tokenNumberElement
        ) {

            tokenNumberElement.textContent =
                "टोकन नंबर: " +
                token;

        }



        const customerName =
            document.getElementById(
                "customerName"
            );


        if (
            customerName
        ) {

            customerName.textContent =
                "नाम: " +
                name;

        }



        const customerAge =
            document.getElementById(
                "customerAge"
            );


        if (
            customerAge
        ) {

            customerAge.textContent =
                "उम्र: " +
                age +
                " वर्ष";
        }



        const customerService =
            document.getElementById(
                "customerService"
            );


        if (
            customerService
        ) {

            customerService.textContent =
                "सेवा: " +
                service;

        }



        const customerDate =
            document.getElementById(
                "customerDate"
            );


        if (
            customerDate
        ) {

            customerDate.textContent =
                "तारीख: " +
                formatDate(date);

        }



        const customerTime =
            document.getElementById(
                "customerTime"
            );


        if (
            customerTime
        ) {

            customerTime.textContent =
                "समय: " +
                time;

        }



        // ==============================================
        // SHOW SLIP
        // ==============================================

        const tokenSlip =
            document.getElementById(
                "tokenSlip"
            );


        if (
            tokenSlip
        ) {

            tokenSlip.style.display =
                "block";


            tokenSlip.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }



        // ==============================================
        // SUCCESS MESSAGE
        // ==============================================

        alert(

            "Booking सफलतापूर्वक हो गई।\n\n" +

            "आपका Token Number: " +
            token

        );



        // ==============================================
        // CLEAR FORM
        // ==============================================

        document.getElementById(
            "name"
        ).value = "";


        document.getElementById(
            "age"
        ).value = "";



        // ==============================================
        // REFRESH DATE STATUS
        // ==============================================

        await loadDateOptions();


    } catch (error) {


        console.error(
            "Firebase Error:",
            error
        );


        alert(

            "Booking सेव नहीं हुई।\n\n" +

            "Firebase Database Rules, Internet या Firebase configuration जाँचें।"

        );

    }

}



// ======================================================
// PDF DOWNLOAD
// ======================================================

async function downloadTokenSlip() {


    const pdfContent =
        document.getElementById(
            "pdfContent"
        );


    if (
        !pdfContent
    ) {

        alert(
            "Token Slip नहीं मिली।"
        );


        return;

    }



    if (
        typeof html2pdf ===
        "undefined"
    ) {

        alert(
            "PDF सिस्टम लोड नहीं हुआ। Internet चालू करके दोबारा प्रयास करें।"
        );


        return;

    }



    // Original styles

    const oldDisplay =
        pdfContent.style.display;


    const oldVisibility =
        pdfContent.style.visibility;



    try {


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



        // Wait for fonts

        if (
            document.fonts &&
            document.fonts.ready
        ) {

            await document.fonts.ready;

        }



        const options = {

            margin:
                10,

            filename:
                "Aadhar-Seva-Kendra-Kanjouli-Token.pdf",

            image: {

                type:
                    "jpeg",

                quality:
                    1

            },

            html2canvas: {

                scale:
                    3,

                useCORS:
                    true,

                backgroundColor:
                    "#ffffff"

            },

            jsPDF: {

                unit:
                    "mm",

                format:
                    "a5",

                orientation:
                    "portrait"

            }

        };



        await html2pdf()
            .set(options)
            .from(pdfContent)
            .save();


    } catch (error) {


        console.error(
            "PDF Error:",
            error
        );


        alert(
            "PDF डाउनलोड करने में समस्या हुई।"
        );


    } finally {


        pdfContent.style.display =
            oldDisplay;


        pdfContent.style.visibility =
            oldVisibility;

    }

}



// ======================================================
// AUTO REFRESH
// ======================================================
//
// हर 30 सेकंड में Token status refresh होगा।
// इससे अगर किसी दूसरे ग्राहक ने Token बुक किया,
// तो Available / FULL status जल्दी update होगा.
//

setInterval(
    async function () {

        try {

            await loadDateOptions();

        } catch (error) {

            console.error(
                "Auto refresh error:",
                error
            );

        }

    },
    30000
);



// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        try {

            await loadDateOptions();

        } catch (error) {

            console.error(
                "Page load error:",
                error
            );

        }

    }
);



// ======================================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// ======================================================

window.bookToken =
    bookToken;


window.downloadTokenSlip =
    downloadTokenSlip;
