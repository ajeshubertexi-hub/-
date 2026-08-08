```javascript
/* =========================================================
   KANJOULI ONLINE TOKEN
   CORRECTED COMPLETE script.js
   ========================================================= */

"use strict";


/* =========================================================
   SETTINGS
   ========================================================= */

const MAX_TOKENS_PER_DAY = 30;

const SLOT_MINUTES = 18;

const START_TIME_MINUTES = 8 * 60;   // 08:00 AM

const LAST_START_TIME = 16 * 60 + 42; // 04:42 PM


/*
   Centre Holidays

   यहाँ तारीख डालें:

   "2026-08-15"

*/

const CENTRE_HOLIDAYS = [

    // "2026-08-15"

];


/* =========================================================
   STORAGE
   ========================================================= */

const STORAGE_KEY =
    "kanjouli_token_bookings_v3";


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        startPortal();

    }
);


/* =========================================================
   START PORTAL
   ========================================================= */

function startPortal() {

    loadDateOptions();

    updatePresentTime();

    setInterval(
        updatePresentTime,
        1000
    );

    setupForm();

    /*
       हर 30 सेकंड में booking status refresh
    */

    setInterval(
        refreshBookingData,
        30000
    );

}


/* =========================================================
   FORM SETUP
   ========================================================= */

function setupForm() {

    const form =
        document.getElementById(
            "bookingForm"
        );


    if (!form) {
        return;
    }


    /*
       अगर form submit हो तो booking
    */

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            bookToken();

        }
    );


    /*
       Time Slot बदलने पर next token
    */

    const timeSlot =
        document.getElementById(
            "timeSlot"
        );


    if (timeSlot) {

        timeSlot.addEventListener(
            "change",
            function () {

                updateNextToken();

            }
        );

    }

}


/* =========================================================
   INDIA CURRENT DATE/TIME
   ========================================================= */

function getIndiaDateTime() {

    const now =
        new Date();


    const parts =
        new Intl.DateTimeFormat(
            "en-GB",
            {
                timeZone:
                    "Asia/Kolkata",

                year:
                    "numeric",

                month:
                    "2-digit",

                day:
                    "2-digit",

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit",

                hourCycle:
                    "h23"
            }
        ).formatToParts(now);


    const data = {};


    parts.forEach(
        function (part) {

            if (
                part.type !==
                "literal"
            ) {

                data[
                    part.type
                ] =
                    part.value;

            }

        }
    );


    return {

        date:
            data.year +
            "-" +
            data.month +
            "-" +
            data.day,

        time:
            data.hour +
            ":" +
            data.minute +
            ":" +
            data.second

    };

}


/* =========================================================
   PRESENT TIME
   ========================================================= */

function updatePresentTime() {

    /*
       अगर HTML में #presentTime है
       तो वहाँ समय दिखाएँ
    */

    const element =
        document.getElementById(
            "presentTime"
        );


    if (!element) {

        return;

    }


    const india =
        getIndiaDateTime();


    const dateParts =
        india.date.split("-");


    const timeParts =
        india.time.split(":");


    const dateObject =
        new Date(
            Number(dateParts[0]),
            Number(dateParts[1]) - 1,
            Number(dateParts[2]),
            Number(timeParts[0]),
            Number(timeParts[1]),
            Number(timeParts[2])
        );


    const dateText =
        dateObject.toLocaleDateString(
            "hi-IN",
            {
                weekday:
                    "long",

                day:
                    "numeric",

                month:
                    "long",

                year:
                    "numeric"
            }
        );


    const timeText =
        dateObject.toLocaleTimeString(
            "en-IN",
            {
                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit",

                hour12:
                    true
            }
        );


    element.innerHTML =

        "📅 " +
        dateText +
        "<br>" +

        "🕐 वर्तमान समय: " +
        timeText +
        " IST";

}


/* =========================================================
   GET BOOKINGS
   ========================================================= */

function getBookings() {

    try {

        const data =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!data) {

            return [];

        }


        const result =
            JSON.parse(
                data
            );


        if (
            !Array.isArray(result)
        ) {

            return [];

        }


        return result;

    }
    catch (error) {

        console.error(
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE BOOKINGS
   ========================================================= */

function saveBookings(
    bookings
) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            bookings
        )
    );

}


/* =========================================================
   DATE HELPERS
   ========================================================= */

function dateToObject(
    dateString
) {

    const p =
        dateString.split("-");


    return new Date(
        Number(p[0]),
        Number(p[1]) - 1,
        Number(p[2])
    );

}


function objectToDate(
    date
) {

    const y =
        date.getFullYear();


    const m =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const d =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        y +
        "-" +
        m +
        "-" +
        d
    );

}


function addDays(
    dateString,
    amount
) {

    const date =
        dateToObject(
            dateString
        );


    date.setDate(
        date.getDate() +
        amount
    );


    return objectToDate(
        date
    );

}


/* =========================================================
   DAY
   ========================================================= */

function isSunday(
    date
) {

    return (
        dateToObject(
            date
        ).getDay() === 0
    );

}


/* =========================================================
   CENTRE OFF
   ========================================================= */

function isCentreOff(
    date
) {

    if (
        isSunday(
            date
        )
    ) {

        return true;

    }


    if (
        CENTRE_HOLIDAYS.includes(
            date
        )
    ) {

        return true;

    }


    return false;

}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(
    dateString
) {

    const date =
        dateToObject(
            dateString
        );


    return date.toLocaleDateString(
        "hi-IN",
        {
            weekday:
                "long",

            day:
                "numeric",

            month:
                "long",

            year:
                "numeric"
        }
    );

}


/* =========================================================
   DATE OPTIONS
   ========================================================= */

function loadDateOptions() {

    const container =
        document.getElementById(
            "dateOptions"
        );


    if (!container) {

        console.error(
            "dateOptions element नहीं मिला"
        );

        return;

    }


    container.innerHTML = "";


    const today =
        getIndiaDateTime().date;


    let firstAvailable =
        null;


    /*
       अगले 10 दिन
    */

    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const date =
            addDays(
                today,
                i
            );


        const card =
            createDateCard(
                date
            );


        container.appendChild(
            card
        );


        /*
           पहला available दिन
        */

        if (
            !firstAvailable &&
            !isCentreOff(date) &&
            getDailyBookingCount(date) <
                MAX_TOKENS_PER_DAY
        ) {

            firstAvailable =
                date;

        }

    }


    /*
       पहला available date select
    */

    if (
        firstAvailable
    ) {

        selectDate(
            firstAvailable
        );

    }
    else {

        const info =
            document.getElementById(
                "selectedDateInfo"
            );


        if (info) {

            info.textContent =
                "अभी कोई उपलब्ध तारीख नहीं है।";

        }

    }

}


/* =========================================================
   CREATE DATE CARD
   ========================================================= */

function createDateCard(
    date
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "date-card";


    card.dataset.date =
        date;


    const dateObject =
        dateToObject(
            date
        );


    const weekday =
        dateObject.toLocaleDateString(
            "hi-IN",
            {
                weekday:
                    "short"
            }
        );


    const month =
        dateObject.toLocaleDateString(
            "hi-IN",
            {
                month:
                    "short"
            }
        );


    const day =
        dateObject.getDate();


    const count =
        getDailyBookingCount(
            date
        );


    const off =
        isCentreOff(
            date
        );


    const full =
        count >=
        MAX_TOKENS_PER_DAY;


    if (off) {

        card.classList.add(
            "off"
        );

    }
    else if (full) {

        card.classList.add(
            "full"
        );

    }
    else {

        card.classList.add(
            "available"
        );

        card.addEventListener(
            "click",
            function () {

                selectDate(
                    date
                );

            }
        );

    }


    let statusText;


    if (off) {

        statusText =
            "Centre OFF";

    }
    else if (full) {

        statusText =
            "FULL";

    }
    else {

        statusText =
            count +
            "/" +
            MAX_TOKENS_PER_DAY +
            " Booked";

    }


    card.innerHTML = `

        <div class="date-day">
            ${weekday}
        </div>

        <div class="date-number">
            ${day}
        </div>

        <div class="date-month">
            ${month}
        </div>

        <small>
            ${statusText}
        </small>

    `;


    return card;

}


/* =========================================================
   DAILY COUNT
   ========================================================= */

function getDailyBookingCount(
    date
) {

    return getBookings()
        .filter(
            function (booking) {

                return (
                    booking.date ===
                    date
                );

            }
        )
        .length;

}


/* =========================================================
   SELECT DATE
   ========================================================= */

function selectDate(
    date
) {

    const bookingDate =
        document.getElementById(
            "bookingDate"
        );


    if (bookingDate) {

        bookingDate.value =
            date;

    }


    /*
       Selected class
    */

    document
        .querySelectorAll(
            ".date-card"
        )
        .forEach(
            function (card) {

                card.classList.remove(
                    "selected"
                );


                if (
                    card.dataset.date ===
                    date
                ) {

                    card.classList.add(
                        "selected"
                    );

                }

            }
        );


    /*
       Information
    */

    const info =
        document.getElementById(
            "selectedDateInfo"
        );


    const count =
        getDailyBookingCount(
            date
        );


    if (info) {

        info.innerHTML =

            "📅 " +
            formatDate(
                date
            ) +

            "<br>" +

            "🎫 " +
            count +
            "/" +
            MAX_TOKENS_PER_DAY +
            " Token Booked";

    }


    /*
       Slots
    */

    loadTimeSlots(
        date
    );


    updateNextToken();

}


/* =========================================================
   TIME SLOT GENERATOR
   ========================================================= */

function loadTimeSlots(
    date
) {

    const select =
        document.getElementById(
            "timeSlot"
        );


    if (!select) {

        return;

    }


    select.innerHTML = "";


    /*
       Centre OFF
    */

    if (
        isCentreOff(date)
    ) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            "";


        option.textContent =
            "Centre OFF";


        select.appendChild(
            option
        );


        return;

    }


    const bookings =
        getBookings();


    /*
       EXACTLY 30 SLOTS

       08:00
       08:18
       08:36
       ...
       16:42
    */

    for (
        let i = 0;
        i < MAX_TOKENS_PER_DAY;
        i++
    ) {

        const start =
            START_TIME_MINUTES +
            (
                i *
                SLOT_MINUTES
            );


        if (
            start >
            LAST_START_TIME
        ) {

            break;

        }


        const end =
            start +
            SLOT_MINUTES;


        const slot =
            formatMinutes(
                start
            ) +
            " - " +
            formatMinutes(
                end
            );


        const option =
            document.createElement(
                "option"
            );


        option.value =
            slot;


        /*
           SAME DATE + SAME SLOT
           CHECK
        */

        const booked =
            bookings.some(
                function (booking) {

                    return (

                        booking.date ===
                        date &&

                        booking.timeSlot ===
                        slot

                    );

                }
            );


        if (booked) {

            option.disabled =
                true;


            option.textContent =
                slot +
                " — BOOKED";

        }
        else {

            option.textContent =
                slot;

        }


        select.appendChild(
            option
        );

    }


    /*
       First available slot
    */

    const first =
        Array.from(
            select.options
        ).find(
            function (option) {

                return !option.disabled;

            }
        );


    if (first) {

        select.value =
            first.value;

    }
    else {

        const fullOption =
            document.createElement(
                "option"
            );


        fullOption.value =
            "";


        fullOption.textContent =
            "सभी 30 स्लॉट BOOKED हैं";


        select.appendChild(
            fullOption
        );


        select.value =
            "";

    }

}


/* =========================================================
   MINUTES -> 12 HOUR
   ========================================================= */

function formatMinutes(
    totalMinutes
) {

    const hour24 =
        Math.floor(
            totalMinutes / 60
        );


    const minutes =
        totalMinutes %
        60;


    const ampm =
        hour24 >= 12
            ? "PM"
            : "AM";


    let hour12 =
        hour24 % 12;


    if (
        hour12 === 0
    ) {

        hour12 =
            12;

    }


    return (

        hour12 +
        ":" +
        String(
            minutes
        ).padStart(
            2,
            "0"
        ) +
        " " +
        ampm

    );

}


/* =========================================================
   NEXT TOKEN
   ========================================================= */

function updateNextToken() {

    const element =
        document.getElementById(
            "nextTokenInfo"
        );


    if (!element) {

        return;

    }


    const dateElement =
        document.getElementById(
            "bookingDate"
        );


    if (
        !dateElement ||
        !dateElement.value
    ) {

        element.textContent =
            "A-001";

        return;

    }


    const count =
        getDailyBookingCount(
            dateElement.value
        );


    if (
        count >=
        MAX_TOKENS_PER_DAY
    ) {

        element.textContent =
            "FULL";

        return;

    }


    element.textContent =
        "A-" +
        String(
            count + 1
        ).padStart(
            3,
            "0"
        );

}


/* =========================================================
   BOOK TOKEN
   ========================================================= */

function bookToken() {

    const nameElement =
        document.getElementById(
            "name"
        );


    const ageElement =
        document.getElementById(
            "age"
        );


    const serviceElement =
        document.getElementById(
            "service"
        );


    const dateElement =
        document.getElementById(
            "bookingDate"
        );


    const timeElement =
        document.getElementById(
            "timeSlot"
        );


    /*
       CHECK ELEMENTS
    */

    if (
        !nameElement ||
        !ageElement ||
        !serviceElement ||
        !dateElement ||
        !timeElement
    ) {

        alert(
            "Booking form का कोई आवश्यक field नहीं मिला।"
        );

        return;

    }


    const name =
        nameElement.value.trim();


    const age =
        ageElement.value;


    const service =
        serviceElement.value;


    const date =
        dateElement.value;


    const timeSlot =
        timeElement.value;


    /*
       VALIDATION
    */

    if (!name) {

        alert(
            "कृपया ग्राहक का नाम भरें।"
        );

        nameElement.focus();

        return;

    }


    if (
        age === "" ||
        Number(age) < 0 ||
        Number(age) > 120
    ) {

        alert(
            "कृपया सही उम्र दर्ज करें।"
        );

        ageElement.focus();

        return;

    }


    if (!date) {

        alert(
            "कृपया तारीख चुनें।"
        );

        return;

    }


    if (!timeSlot) {

        alert(
            "कृपया Time Slot चुनें।"
        );

        return;

    }


    /*
       CENTRE OFF
    */

    if (
        isCentreOff(date)
    ) {

        alert(
            "इस तारीख को Centre OFF है।"
        );

        return;

    }


    /*
       GET CURRENT BOOKINGS
    */

    const bookings =
        getBookings();


    /*
       DAILY LIMIT
    */

    const todayBookings =
        bookings.filter(
            function (booking) {

                return (
                    booking.date ===
                    date
                );

            }
        );


    if (
        todayBookings.length >=
        MAX_TOKENS_PER_DAY
    ) {

        alert(
            "इस तारीख के सभी 30 Token Book हो चुके हैं।"
        );


        loadDateOptions();


        return;

    }


    /*
       =====================================================
       DUPLICATE PROTECTION
       SAME DATE + SAME TIME
       =====================================================
    */

    const duplicate =
        bookings.some(
            function (booking) {

                return (

                    booking.date ===
                    date &&

                    booking.timeSlot ===
                    timeSlot

                );

            }
        );


    if (duplicate) {

        alert(

            "⚠️ यह Time Slot पहले से Book है।\n\n" +

            "📅 " +
            formatDate(
                date
            ) +

            "\n⏰ " +
            timeSlot +

            "\n\nकृपया दूसरा Slot चुनें।"

        );


        loadTimeSlots(
            date
        );


        return;

    }


    /*
       TOKEN NUMBER
    */

    const token =
        "A-" +
        String(
            todayBookings.length + 1
        ).padStart(
            3,
            "0"
        );


    /*
       CURRENT INDIA TIME
    */

    const current =
        getIndiaDateTime();


    /*
       BOOKING OBJECT
    */

    const booking = {

        id:
            Date.now(),

        token:
            token,

        name:
            name,

        age:
            Number(age),

        service:
            service,

        date:
            date,

        timeSlot:
            timeSlot,

        bookingDate:
            current.date,

        bookingTime:
            current.time

    };


    /*
       SAVE
    */

    bookings.push(
        booking
    );


    saveBookings(
        bookings
    );


    /*
       SHOW SLIP
    */

    showTokenSlip(
        booking
    );


    /*
       REFRESH
    */

    loadDateOptions();


    /*
       Restore selected date
    */

    selectDate(
        date
    );


    /*
       Clear customer fields
    */

    nameElement.value =
        "";


    ageElement.value =
        "";


    /*
       SUCCESS
    */

    alert(

        "✅ Booking सफल हुई!\n\n" +

        "🎫 Token: " +
        token +

        "\n📅 " +
        formatDate(
            date
        ) +

        "\n⏰ " +
        timeSlot

    );


    /*
       Scroll Token Slip
    */

    const slip =
        document.getElementById(
            "tokenSlip"
        );


    if (slip) {

        slip.scrollIntoView({
            behavior:
                "smooth"
        });

    }

}


/* =========================================================
   TOKEN SLIP
   ========================================================= */

function showTokenSlip(
    booking
) {

    setText(
        "tokenNumber",
        booking.token
    );


    setText(
        "customerName",
        "नाम: " +
        booking.name
    );


    setText(
        "customerAge",
        "उम्र: " +
        booking.age +
        " वर्ष"
    );


    setText(
        "customerService",
        "सेवा: " +
        booking.service
    );


    setText(
        "customerDate",
        "तारीख: " +
        formatDate(
            booking.date
        )
    );


    setText(
        "customerTime",
        "समय: " +
        booking.timeSlot
    );


    /*
       Optional booking time
    */

    setText(
        "bookingTime",
        "Booking Time: " +
        booking.bookingDate +
        " " +
        booking.bookingTime
    );

}


/* =========================================================
   SET TEXT
   ========================================================= */

function setText(
    id,
    text
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            text;

    }

}


/* =========================================================
   CHECK STATUS
   ========================================================= */

function checkStatus() {

    const tokenInput =
        prompt(
            "Token Number डालें\nउदाहरण: A-001"
        );


    if (!tokenInput) {

        return;

    }


    const token =
        tokenInput
            .trim()
            .toUpperCase();


    const booking =
        getBookings().find(
            function (item) {

                return (

                    String(
                        item.token
                    ).toUpperCase() ===
                    token

                );

            }
        );


    if (!booking) {

        alert(
            "❌ Token नहीं मिला।"
        );

        return;

    }


    alert(

        "🎫 Token: " +
        booking.token +

        "\n\n👤 नाम: " +
        booking.name +

        "\n🎂 उम्र: " +
        booking.age +

        "\n\n🪪 सेवा: " +
        booking.service +

        "\n\n📅 तारीख: " +
        formatDate(
            booking.date
        ) +

        "\n⏰ समय: " +
        booking.timeSlot +

        "\n\n✅ Status: BOOKED"

    );

}


/* =========================================================
   DOWNLOAD PDF
   ========================================================= */

function downloadTokenSlip() {

    const content =
        document.getElementById(
            "pdfContent"
        );


    const token =
        document.getElementById(
            "tokenNumber"
        );


    if (
        !content ||
        !token ||
        !token.textContent.trim()
    ) {

        alert(
            "पहले Token Book करें।"
        );

        return;

    }


    /*
       jsPDF + html2canvas मौजूद हैं
       तो PDF बनाएँ
    */

    if (
        typeof html2canvas !==
            "undefined" &&

        window.jspdf
    ) {

        html2canvas(
            content,
            {
                scale:
                    2,

                backgroundColor:
                    "#ffffff"
            }
        )
        .then(
            function (canvas) {

                const jsPDF =
                    window.jspdf
                        .jsPDF;


                const pdf =
                    new jsPDF(
                        "p",
                        "mm",
                        "a4"
                    );


                const img =
                    canvas.toDataURL(
                        "image/png"
                    );


                const width =
                    pdf.internal
                        .pageSize
                        .getWidth() -
                    20;


                const height =
                    (
                        canvas.height *
                        width
                    ) /
                    canvas.width;


                pdf.addImage(
                    img,
                    "PNG",
                    10,
                    10,
                    width,
                    height
                );


                pdf.save(
                    "Token-" +
                    token.textContent.trim() +
                    ".pdf"
                );

            }
        );


        return;

    }


    /*
       Library नहीं है तो Print
    */

    alert(
        "PDF Library उपलब्ध नहीं है। Print window में 'Save as PDF' चुनें।"
    );


    window.print();

}


/* =========================================================
   REFRESH
   ========================================================= */

function refreshBookingData() {

    const selected =
        document.getElementById(
            "bookingDate"
        );


    const currentDate =
        selected
            ? selected.value
            : null;


    loadDateOptions();


    if (
        currentDate
    ) {

        selectDate(
            currentDate
        );

    }

}


/* =========================================================
   PRINT
   ========================================================= */

function printTokenSlip() {

    window.print();

}


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.bookToken =
    bookToken;

window.downloadTokenSlip =
    downloadTokenSlip;

window.checkStatus =
    checkStatus;

window.printTokenSlip =
    printTokenSlip;


/* =========================================================
   END
   ========================================================= */
```
