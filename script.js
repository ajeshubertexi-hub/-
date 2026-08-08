```javascript
/* =========================================================
   KANJOULI ONLINE TOKEN
   script.js
========================================================= */


/* =========================================================
   SETTINGS
========================================================= */

const MAX_TOKENS_PER_DAY = 30;

const TIME_ZONE = "Asia/Kolkata";


/*
   Centre Holidays
   YYYY-MM-DD format में तारीख डालें।

   Example:
   const holidays = [
       "2026-08-15",
       "2026-08-20"
   ];
*/

const holidays = [];


/* =========================================================
   STORAGE KEY
========================================================= */

const STORAGE_KEY = "kanjouliBookings";


/* =========================================================
   GET BOOKINGS
========================================================= */

function getBookings() {

    try {

        const data =
            localStorage.getItem(STORAGE_KEY);

        if (!data) {
            return [];
        }

        const bookings =
            JSON.parse(data);

        return Array.isArray(bookings)
            ? bookings
            : [];

    } catch (error) {

        console.error(
            "Booking data read error:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE BOOKINGS
========================================================= */

function saveBookings(bookings) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(bookings)
        );

        return true;

    } catch (error) {

        console.error(
            "Booking data save error:",
            error
        );

        alert(
            "Booking data save नहीं हो पाया।"
        );

        return false;

    }

}


/* =========================================================
   CURRENT IST DATE
========================================================= */

function getISTDate() {

    const now =
        new Date();

    const parts =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: TIME_ZONE,
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        ).formatToParts(now);

    const values = {};

    parts.forEach(
        part => {

            if (part.type !== "literal") {

                values[part.type] =
                    part.value;

            }

        }
    );

    return (
        values.year +
        "-" +
        values.month +
        "-" +
        values.day
    );

}


/* =========================================================
   CURRENT IST DATE + TIME
========================================================= */

function getCurrentISTDateTime() {

    const now =
        new Date();

    const date =
        now.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: TIME_ZONE
            }
        );

    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
                timeZone: TIME_ZONE
            }
        );

    return {
        date: date,
        time: time,
        dateTime:
            date + " • " + time
    };

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "--";
    }

    const date =
        new Date(
            dateString + "T00:00:00"
        );

    if (isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString(
        "hi-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================================
   GET DATE BOOKING COUNT
========================================================= */

function getDateBookingCount(date) {

    const bookings =
        getBookings();

    return bookings.filter(
        booking =>
            booking.date === date
    ).length;

}


/* =========================================================
   CHECK SUNDAY
========================================================= */

function isSunday(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );

    return date.getDay() === 0;

}


/* =========================================================
   CHECK HOLIDAY
========================================================= */

function isHoliday(dateString) {

    return holidays.includes(
        dateString
    );

}


/* =========================================================
   CHECK CENTRE OFF
========================================================= */

function isCentreOff(dateString) {

    return (
        isSunday(dateString) ||
        isHoliday(dateString)
    );

}


/* =========================================================
   CHECK FULL
========================================================= */

function isDateFull(dateString) {

    return (
        getDateBookingCount(
            dateString
        ) >= MAX_TOKENS_PER_DAY
    );

}


/* =========================================================
   GET NEXT TOKEN
========================================================= */

function getNextTokenNumber(date) {

    const count =
        getDateBookingCount(date);

    return (
        "A-" +
        String(
            count + 1
        ).padStart(
            3,
            "0"
        )
    );

}


/* =========================================================
   UPDATE PRESENT TIME
========================================================= */

function updatePresentTime() {

    const element =
        document.getElementById(
            "presentTime"
        );

    if (!element) {
        return;
    }

    const current =
        getCurrentISTDateTime();

    element.innerHTML =

        "📅 " +
        current.date +
        "<br>" +

        "⏰ " +
        current.time;

}


/* =========================================================
   LOAD DATE CARDS
========================================================= */

function loadDates() {

    const container =
        document.getElementById(
            "dateOptions"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";


    const todayString =
        getISTDate();


    const today =
        new Date(
            todayString +
            "T00:00:00"
        );


    let firstAvailable = null;


    /*
       अगले 14 दिन दिखाएँ
    */

    for (
        let i = 0;
        i < 14;
        i++
    ) {

        const date =
            new Date(today);

        date.setDate(
            today.getDate() + i
        );


        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );


        const dateString =
            year +
            "-" +
            month +
            "-" +
            day;


        const dayName =
            date.toLocaleDateString(
                "hi-IN",
                {
                    weekday: "short"
                }
            );


        const monthName =
            date.toLocaleDateString(
                "hi-IN",
                {
                    month: "short"
                }
            );


        const bookingCount =
            getDateBookingCount(
                dateString
            );


        const remaining =
            MAX_TOKENS_PER_DAY -
            bookingCount;


        const sunday =
            isSunday(
                dateString
            );


        const holiday =
            isHoliday(
                dateString
            );


        const full =
            remaining <= 0;


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "date-card";


        /* =========================
           CENTRE OFF
        ========================= */

        if (
            sunday ||
            holiday
        ) {

            card.classList.add(
                "off"
            );


            let offText =
                "Centre OFF";


            if (sunday) {

                offText =
                    "Sunday OFF";

            }


            if (
                holiday &&
                !sunday
            ) {

                offText =
                    "Holiday OFF";

            }


            card.innerHTML = `

                <div class="date-day">
                    ${dayName}
                </div>

                <div class="date-number">
                    ${day}
                </div>

                <div class="date-month">
                    ${monthName}
                </div>

                <small>
                    ${offText}
                </small>

            `;

        }


        /* =========================
           FULL
        ========================= */

        else if (full) {

            card.classList.add(
                "full"
            );


            card.innerHTML = `

                <div class="date-day">
                    ${dayName}
                </div>

                <div class="date-number">
                    ${day}
                </div>

                <div class="date-month">
                    ${monthName}
                </div>

                <small>
                    FULL
                </small>

            `;

        }


        /* =========================
           AVAILABLE
        ========================= */

        else {

            card.classList.add(
                "available"
            );


            card.innerHTML = `

                <div class="date-day">
                    ${dayName}
                </div>

                <div class="date-number">
                    ${day}
                </div>

                <div class="date-month">
                    ${monthName}
                </div>

                <small>
                    ${remaining} Token
                </small>

            `;


            card.addEventListener(
                "click",
                function () {

                    selectDate(
                        dateString,
                        card
                    );

                }
            );


            if (
                !firstAvailable
            ) {

                firstAvailable = {

                    date:
                        dateString,

                    card:
                        card

                };

            }

        }


        container.appendChild(
            card
        );

    }


    /*
       पहले Available दिन को select करें
    */

    if (firstAvailable) {

        selectDate(
            firstAvailable.date,
            firstAvailable.card
        );

    }

    else {

        const info =
            document.getElementById(
                "selectedDateInfo"
            );

        if (info) {

            info.innerHTML =
                "अभी कोई Available date नहीं है।";

        }

    }

}


/* =========================================================
   SELECT DATE
========================================================= */

function selectDate(
    date,
    card
) {

    if (!date || !card) {
        return;
    }


    if (
        isCentreOff(date)
    ) {

        return;

    }


    if (
        isDateFull(date)
    ) {

        return;

    }


    /*
       Remove previous selected
    */

    document
        .querySelectorAll(
            ".date-card"
        )
        .forEach(
            item => {

                item.classList.remove(
                    "selected"
                );

            }
        );


    card.classList.add(
        "selected"
    );


    const bookingDate =
        document.getElementById(
            "bookingDate"
        );


    if (bookingDate) {

        bookingDate.value =
            date;

    }


    const count =
        getDateBookingCount(
            date
        );


    const remaining =
        MAX_TOKENS_PER_DAY -
        count;


    const info =
        document.getElementById(
            "selectedDateInfo"
        );


    if (info) {

        info.innerHTML =

            "📅 " +
            formatDate(date) +

            " • " +

            remaining +

            " Token Available";

    }


    updateNextToken();

}


/* =========================================================
   UPDATE NEXT TOKEN
========================================================= */

function updateNextToken() {

    const bookingDate =
        document.getElementById(
            "bookingDate"
        );


    const nextToken =
        document.getElementById(
            "nextTokenInfo"
        );


    if (
        !bookingDate ||
        !nextToken
    ) {

        return;

    }


    const date =
        bookingDate.value;


    if (!date) {

        nextToken.textContent =
            "A-001";

        return;

    }


    if (
        isCentreOff(date)
    ) {

        nextToken.textContent =
            "OFF";

        return;

    }


    if (
        isDateFull(date)
    ) {

        nextToken.textContent =
            "FULL";

        return;

    }


    nextToken.textContent =
        getNextTokenNumber(
            date
        );

}


/* =========================================================
   VALIDATE BOOKING FORM
========================================================= */

function validateBookingForm() {

    const name =
        document.getElementById(
            "name"
        );

    const age =
        document.getElementById(
            "age"
        );

    const service =
        document.getElementById(
            "service"
        );

    const timeSlot =
        document.getElementById(
            "timeSlot"
        );

    const bookingDate =
        document.getElementById(
            "bookingDate"
        );


    if (!bookingDate?.value) {

        alert(
            "कृपया पहले Booking की तारीख चुनें।"
        );

        return false;

    }


    if (!name?.value.trim()) {

        alert(
            "कृपया ग्राहक का नाम लिखें।"
        );

        name?.focus();

        return false;

    }


    if (
        age?.value === "" ||
        Number(age.value) < 0 ||
        Number(age.value) > 120
    ) {

        alert(
            "कृपया सही उम्र दर्ज करें।"
        );

        age?.focus();

        return false;

    }


    if (!service?.value) {

        alert(
            "कृपया सेवा चुनें।"
        );

        return false;

    }


    if (!timeSlot?.value) {

        alert(
            "कृपया समय स्लॉट चुनें।"
        );

        return false;

    }


    return true;

}


/* =========================================================
   BOOK TOKEN
========================================================= */

function bookToken() {

    /*
       Form validation
    */

    if (
        !validateBookingForm()
    ) {

        return;

    }


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


    const timeSlot =
        document.getElementById(
            "timeSlot"
        ).value;


    const date =
        document.getElementById(
            "bookingDate"
        ).value;


    /*
       Centre OFF check
    */

    if (
        isCentreOff(date)
    ) {

        alert(
            "इस तारीख को Centre OFF है।"
        );

        loadDates();

        return;

    }


    /*
       Current booking count
    */

    const bookings =
        getBookings();


    const currentCount =
        bookings.filter(
            booking =>
                booking.date === date
        ).length;


    /*
       30 Token limit
    */

    if (
        currentCount >=
        MAX_TOKENS_PER_DAY
    ) {

        alert(
            "इस तारीख के सभी 30 Token बुक हो चुके हैं।"
        );

        loadDates();

        return;

    }


    /*
       EXACT CURRENT IST TIME
    */

    const current =
        getCurrentISTDateTime();


    /*
       TOKEN NUMBER
    */

    const tokenNumber =
        "A-" +
        String(
            currentCount + 1
        ).padStart(
            3,
            "0"
        );


    /*
       BOOKING OBJECT
    */

    const booking = {

        id:
            Date.now(),

        token:
            tokenNumber,

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
            current.time,

        bookingDateTime:
            current.dateTime,

        createdAt:
            new Date().toISOString()

    };


    /*
       SAVE
    */

    bookings.push(
        booking
    );


    const saved =
        saveBookings(
            bookings
        );


    if (!saved) {

        return;

    }


    /*
       SHOW TOKEN SLIP
    */

    showTokenSlip(
        booking
    );


    /*
       RESET FORM
    */

    const form =
        document.getElementById(
            "bookingForm"
        );


    if (form) {

        form.reset();

    }


    /*
       Reload dates
    */

    loadDates();


    /*
       Scroll to slip
    */

    const slip =
        document.getElementById(
            "tokenSlip"
        );


    if (slip) {

        slip.scrollIntoView({
            behavior: "smooth"
        });

    }


    /*
       Toast
    */

    showToast(
        "🎫 Token " +
        tokenNumber +
        " successfully booked"
    );

}


/* =========================================================
   SHOW TOKEN SLIP
========================================================= */

function showTokenSlip(
    booking
) {

    const tokenNumber =
        document.getElementById(
            "tokenNumber"
        );

    const customerName =
        document.getElementById(
            "customerName"
        );

    const customerAge =
        document.getElementById(
            "customerAge"
        );

    const customerService =
        document.getElementById(
            "customerService"
        );

    const customerDate =
        document.getElementById(
            "customerDate"
        );

    const customerTime =
        document.getElementById(
            "customerTime"
        );

    const bookingTime =
        document.getElementById(
            "bookingTime"
        );


    if (tokenNumber) {

        tokenNumber.textContent =
            booking.token;

    }


    if (customerName) {

        customerName.textContent =
            booking.name;

    }


    if (customerAge) {

        customerAge.textContent =
            booking.age +
            " वर्ष";

    }


    if (customerService) {

        customerService.textContent =
            booking.service;

    }


    if (customerDate) {

        customerDate.textContent =
            formatDate(
                booking.date
            );

    }


    if (customerTime) {

        customerTime.textContent =
            booking.timeSlot;

    }


    if (bookingTime) {

        bookingTime.textContent =
            booking.bookingDateTime;

    }

}


/* =========================================================
   CHECK STATUS
========================================================= */

function checkStatus() {

    const bookings =
        getBookings();


    if (
        bookings.length === 0
    ) {

        alert(
            "अभी कोई Booking उपलब्ध नहीं है।"
        );

        return;

    }


    const token =
        prompt(
            "अपना Token Number डालें:\nExample: A-001"
        );


    if (!token) {

        return;

    }


    const search =
        token
            .trim()
            .toUpperCase();


    const booking =
        bookings.find(
            item =>
                item.token
                    .toUpperCase() ===
                search
        );


    if (!booking) {

        alert(
            "यह Token Number नहीं मिला।"
        );

        return;

    }


    alert(

        "🎫 Token Status\n\n" +

        "Token: " +
        booking.token +
        "\n" +

        "नाम: " +
        booking.name +
        "\n" +

        "उम्र: " +
        booking.age +
        "\n" +

        "सेवा: " +
        booking.service +
        "\n" +

        "तारीख: " +
        formatDate(
            booking.date
        ) +
        "\n" +

        "समय स्लॉट: " +
        booking.timeSlot +
        "\n" +

        "Booking Time: " +
        booking.bookingDateTime

    );

}


/* =========================================================
   LOAD LAST BOOKING
========================================================= */

function loadLastBooking() {

    const bookings =
        getBookings();


    if (
        bookings.length === 0
    ) {

        return;

    }


    const last =
        bookings[
            bookings.length - 1
        ];


    showTokenSlip(
        last
    );

}


/* =========================================================
   PRINT TOKEN SLIP
========================================================= */

function printTokenSlip() {

    const token =
        document.getElementById(
            "tokenNumber"
        );


    if (
        !token ||
        token.textContent === "--"
    ) {

        alert(
            "पहले Token Book करें।"
        );

        return;

    }


    window.print();

}


/* =========================================================
   DOWNLOAD TOKEN SLIP
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
        token.textContent === "--"
    ) {

        alert(
            "पहले Token Book करें।"
        );

        return;

    }


    /*
       NOTE:
       यह browser से HTML slip download करता है।
       Actual PDF बनाने के लिए jsPDF जैसी
       PDF library की जरूरत होगी।
    */


    const html = `

<!DOCTYPE html>

<html lang="hi">

<head>

<meta charset="UTF-8">

<title>Kanjouli Token Slip</title>

<style>

body{

    font-family:
        Arial,
        "Noto Sans Devanagari",
        sans-serif;

    background:#f4f4f4;

    padding:20px;

}

.slip{

    max-width:600px;

    margin:auto;

    background:white;

    border:2px solid #047857;

    border-radius:12px;

    padding:25px;

    text-align:center;

}

.token{

    font-size:45px;

    font-weight:bold;

    color:#047857;

    margin:20px 0;

}

hr{

    border:none;

    border-top:
        1px solid #aaa;

}

</style>

</head>

<body>

<div class="slip">

${content.innerHTML}

</div>

</body>

</html>

`;


    const blob =
        new Blob(
            [html],
            {
                type:
                    "text/html;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "Kanjouli-Token-Slip-" +
        token.textContent +
        ".html";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    setTimeout(
        function () {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );

}


/* =========================================================
   TOAST MESSAGE
========================================================= */

function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        alert(message);

        return;

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}


/* =========================================================
   CLEAR ALL BOOKINGS
   केवल Admin/testing के लिए
========================================================= */

function clearAllBookings() {

    const confirmDelete =
        confirm(
            "क्या आप सभी Booking delete करना चाहते हैं?"
        );


    if (!confirmDelete) {

        return;

    }


    localStorage.removeItem(
        STORAGE_KEY
    );


    alert(
        "सभी Booking delete हो गईं।"
    );


    loadDates();

    updateNextToken();

}


/* =========================================================
   UPDATE TOKEN EVERY SECOND
========================================================= */

setInterval(
    updatePresentTime,
    1000
);


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
           Live Present Time
        */

        updatePresentTime();


        /*
           Date Cards
        */

        loadDates();


        /*
           Last Booking
        */

        loadLastBooking();


        /*
           Booking Form
        */

        const form =
            document.getElementById(
                "bookingForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    bookToken();

                }
            );

        }

    }
);


/* =========================================================
   END OF SCRIPT
========================================================= */
```
