```javascript
/* =========================================================
   KANJOULI ONLINE TOKEN
   COMPLETE script.js

   FEATURES
   ---------------------------------------------------------
   • 8:00 AM से Booking
   • प्रत्येक Token = 18 मिनट
   • अधिकतम 30 Token प्रति Working Day
   • Same Date + Same Time Slot = Duplicate Booking बंद
   • Sunday OFF
   • Centre Holidays OFF
   • Present IST Time
   • Automatic Token Number
   • Token Slip
   • Print
   • PDF Download
   • LocalStorage Booking Data
========================================================= */


/* =========================================================
   SETTINGS
========================================================= */

const MAX_TOKENS_PER_DAY = 30;

const SLOT_MINUTES = 18;

const START_HOUR = 8;

const START_MINUTE = 0;

const END_HOUR = 17;

const END_MINUTE = 0;


/*
   अपनी Centre Holiday यहाँ डाल सकते हैं।

   Format:

   "YYYY-MM-DD"

   Example:

   "2026-08-15"
*/

const CENTRE_HOLIDAYS = [

    // "2026-08-15",
    // "2026-08-20"

];


/* =========================================================
   STORAGE KEY
========================================================= */

const STORAGE_KEY =
    "kanjouli_online_token_bookings";


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializePortal();

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

function initializePortal() {

    updatePresentTime();

    setInterval(
        updatePresentTime,
        1000
    );


    loadDates();


    setupBookingForm();


    updateNextToken();


    /*
       Time slot changes होने पर
       next token information update होगी।
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
   BOOKING FORM
========================================================= */

function setupBookingForm() {

    const form =
        document.getElementById(
            "bookingForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            bookToken();

        }
    );

}


/* =========================================================
   CURRENT IST DATE/TIME
========================================================= */

function getCurrentISTDateTime() {

    const now =
        new Date();


    const parts =
        new Intl.DateTimeFormat(
            "en-GB",
            {
                timeZone:
                    "Asia/Kolkata",

                year: "numeric",

                month: "2-digit",

                day: "2-digit",

                hour: "2-digit",

                minute: "2-digit",

                second: "2-digit",

                hourCycle: "h23"
            }
        ).formatToParts(now);


    const values = {};


    parts.forEach(
        part => {

            if (
                part.type !==
                "literal"
            ) {

                values[
                    part.type
                ] =
                    part.value;

            }

        }
    );


    const date =
        values.year +
        "-" +
        values.month +
        "-" +
        values.day;


    const time =
        values.hour +
        ":" +
        values.minute +
        ":" +
        values.second;


    return {

        date: date,

        time: time,

        dateTime:
            date +
            " " +
            time

    };

}


/* =========================================================
   PRESENT TIME DISPLAY
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


    const dateObject =
        new Date(
            current.date +
            "T" +
            current.time
        );


    const dateText =
        dateObject.toLocaleDateString(
            "hi-IN",
            {
                timeZone:
                    "Asia/Kolkata",

                weekday:
                    "long",

                day:
                    "2-digit",

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
                timeZone:
                    "Asia/Kolkata",

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


        const bookings =
            JSON.parse(
                data
            );


        if (
            !Array.isArray(
                bookings
            )
        ) {

            return [];

        }


        return bookings;

    }
    catch (error) {

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

function saveBookings(
    bookings
) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                bookings
            )
        );


        return true;

    }
    catch (error) {

        console.error(
            "Booking save error:",
            error
        );


        alert(
            "Booking save नहीं हो सकी। कृपया browser storage check करें।"
        );


        return false;

    }

}


/* =========================================================
   CENTRE OFF CHECK
========================================================= */

function isCentreOff(
    date
) {

    /*
       Sunday

       JavaScript:
       0 = Sunday
    */

    const day =
        getDayOfWeek(
            date
        );


    if (day === 0) {

        return true;

    }


    /*
       Holiday
    */

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
   DAY OF WEEK
========================================================= */

function getDayOfWeek(
    date
) {

    const parts =
        date.split("-");


    const year =
        Number(
            parts[0]
        );

    const month =
        Number(
            parts[1]
        ) - 1;

    const day =
        Number(
            parts[2]
        );


    return new Date(
        year,
        month,
        day
    ).getDay();

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


    const today =
        getCurrentISTDateTime();


    /*
       अगले 10 दिन दिखाएँ
    */

    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const date =
            addDays(
                today.date,
                i
            );


        createDateCard(
            container,
            date
        );

    }


    /*
       पहले available date को
       automatically select करें
    */

    autoSelectFirstAvailableDate();

}


/* =========================================================
   ADD DAYS
========================================================= */

function addDays(
    dateString,
    days
) {

    const parts =
        dateString.split("-");


    const date =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );


    date.setDate(
        date.getDate() +
        days
    );


    return formatDateForStorage(
        date
    );

}


/* =========================================================
   FORMAT DATE FOR STORAGE
========================================================= */

function formatDateForStorage(
    date
) {

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


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


/* =========================================================
   CREATE DATE CARD
========================================================= */

function createDateCard(
    container,
    date
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "date-card";


    const day =
        getDayOfWeek(
            date
        );


    const bookings =
        getBookings();


    const count =
        bookings.filter(
            booking =>
                booking.date ===
                date
        ).length;


    const off =
        isCentreOff(
            date
        );


    const full =
        count >=
        MAX_TOKENS_PER_DAY;


    /*
       DATE OBJECT
    */

    const parts =
        date.split("-");


    const dateObject =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
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


    const dayNumber =
        dateObject.getDate();


    /*
       CARD CLASS
    */

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

    }


    /*
       HTML
    */

    card.innerHTML = `

        <div class="date-day">
            ${weekday}
        </div>

        <div class="date-number">
            ${dayNumber}
        </div>

        <div class="date-month">
            ${month}
        </div>

        <small>

            ${
                off
                    ? "Centre OFF"
                    : full
                        ? "FULL"
                        : `${count}/${MAX_TOKENS_PER_DAY} Booked`
            }

        </small>

    `;


    /*
       CLICK
    */

    if (
        !off &&
        !full
    ) {

        card.addEventListener(
            "click",
            function () {

                selectDate(
                    date,
                    card
                );

            }
        );

    }


    container.appendChild(
        card
    );

}


/* =========================================================
   AUTO SELECT FIRST AVAILABLE DATE
========================================================= */

function autoSelectFirstAvailableDate() {

    const today =
        getCurrentISTDateTime();


    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const date =
            addDays(
                today.date,
                i
            );


        const bookings =
            getBookings();


        const count =
            bookings.filter(
                booking =>
                    booking.date ===
                    date
            ).length;


        if (
            !isCentreOff(date) &&
            count < MAX_TOKENS_PER_DAY
        ) {

            const cards =
                document.querySelectorAll(
                    ".date-card.available"
                );


            for (
                const card of cards
            ) {

                /*
                   Card text देखकर
                   date select करने के बजाय
                   directly function call करना
                   बेहतर है।
                */

                card.classList.remove(
                    "selected"
                );

            }


            selectDateByValue(
                date
            );


            return;

        }

    }


    const info =
        document.getElementById(
            "selectedDateInfo"
        );


    if (info) {

        info.textContent =
            "अभी कोई उपलब्ध तारीख नहीं मिली।";

    }

}


/* =========================================================
   SELECT DATE BY VALUE
========================================================= */

function selectDateByValue(
    date
) {

    const cards =
        document.querySelectorAll(
            ".date-card"
        );


    let targetCard =
        null;


    cards.forEach(
        card => {

            const small =
                card.querySelector(
                    ".date-month"
                );

            /*
               Date directly store करने के लिए
               dataset बनाया जा रहा है।
            */

        }
    );


    /*
       Existing card को date dataset से खोजें
    */

    cards.forEach(
        card => {

            if (
                card.dataset.date ===
                date
            ) {

                targetCard =
                    card;

            }

        }
    );


    /*
       पुराने cards में dataset न हो तो
       recreate करने की जरूरत नहीं।
       इसलिए नीचे date cards में dataset
       सुनिश्चित किया जाता है।
    */

    if (
        targetCard
    ) {

        selectDate(
            date,
            targetCard
        );

    }
    else {

        /*
           fallback
        */

        selectDate(
            date,
            null
        );

    }

}


/* =========================================================
   SELECT DATE
========================================================= */

function selectDate(
    date,
    card
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
       Selected card
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


    if (card) {

        card.classList.add(
            "selected"
        );

    }
    else {

        /*
           fallback card search
        */

        document
            .querySelectorAll(
                ".date-card"
            )
            .forEach(
                item => {

                    if (
                        item.dataset.date ===
                        date
                    ) {

                        item.classList.add(
                            "selected"
                        );

                    }

                }
            );

    }


    /*
       Selected date information
    */

    updateSelectedDateInfo(
        date
    );


    /*
       Generate 18-minute slots
    */

    generateTimeSlots(
        date
    );


    /*
       Next token
    */

    updateNextToken();

}


/* =========================================================
   SELECTED DATE INFORMATION
========================================================= */

function updateSelectedDateInfo(
    date
) {

    const element =
        document.getElementById(
            "selectedDateInfo"
        );


    if (!element) {
        return;
    }


    const parts =
        date.split("-");


    const dateObject =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );


    const text =
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


    const bookings =
        getBookings();


    const count =
        bookings.filter(
            booking =>
                booking.date ===
                date
        ).length;


    element.innerHTML =

        "📅 Selected Date: " +
        text +
        "<br>" +

        "🎫 " +
        count +
        "/" +
        MAX_TOKENS_PER_DAY +
        " Token Booked";

}


/* =========================================================
   GENERATE 18 MINUTE TIME SLOTS
========================================================= */

function generateTimeSlots(
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


    if (
        isCentreOff(date)
    ) {

        const option =
            document.createElement(
                "option"
            );


        option.textContent =
            "Centre OFF";


        option.value = "";


        select.appendChild(
            option
        );


        return;

    }


    const bookings =
        getBookings();


    /*
       30 slots

       8:00
       8:18
       8:36
       ...
       16:42
       17:00
    */

    for (
        let i = 0;
        i < MAX_TOKENS_PER_DAY;
        i++
    ) {

        const totalMinutes =
            (
                START_HOUR * 60
            ) +
            START_MINUTE +
            (
                i *
                SLOT_MINUTES
            );


        const startHour =
            Math.floor(
                totalMinutes / 60
            );


        const startMinute =
            totalMinutes % 60;


        const endTotal =
            totalMinutes +
            SLOT_MINUTES;


        const endHour =
            Math.floor(
                endTotal / 60
            );


        const endMinute =
            endTotal % 60;


        /*
           यदि अंतिम slot 5 PM से
           आगे जा रहा हो तो stop करें।
        */

        if (
            endHour >
                END_HOUR ||
            (
                endHour ===
                    END_HOUR &&
                endMinute >
                    END_MINUTE
            )
        ) {

            break;

        }


        const startText =
            formatTime12Hour(
                startHour,
                startMinute
            );


        const endText =
            formatTime12Hour(
                endHour,
                endMinute
            );


        const slotText =
            startText +
            " - " +
            endText;


        const option =
            document.createElement(
                "option"
            );


        option.value =
            slotText;


        option.textContent =
            slotText;


        /*
           Same Date + Same Slot
           पहले से booked है या नहीं
        */

        const alreadyBooked =
            bookings.some(
                booking =>

                    booking.date ===
                    date &&

                    booking.timeSlot ===
                    slotText
            );


        if (
            alreadyBooked
        ) {

            option.disabled =
                true;


            option.textContent =
                slotText +
                " — BOOKED";


            option.dataset.booked =
                "true";

        }


        select.appendChild(
            option
        );

    }


    /*
       Available slot select करें
    */

    const firstAvailable =
        Array.from(
            select.options
        ).find(
            option =>
                !option.disabled
        );


    if (
        firstAvailable
    ) {

        select.value =
            firstAvailable.value;

    }
    else {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            "";


        option.textContent =
            "सभी स्लॉट BOOKED हैं";


        select.appendChild(
            option
        );


        select.value =
            "";

    }


}


/* =========================================================
   FORMAT 12 HOUR TIME
========================================================= */

function formatTime12Hour(
    hour,
    minute
) {

    const suffix =
        hour >= 12
            ? "PM"
            : "AM";


    let displayHour =
        hour % 12;


    if (
        displayHour === 0
    ) {

        displayHour =
            12;

    }


    return (

        displayHour +
        ":" +
        String(
            minute
        ).padStart(
            2,
            "0"
        ) +
        " " +
        suffix

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


    const bookingDate =
        document.getElementById(
            "bookingDate"
        );


    const timeSlot =
        document.getElementById(
            "timeSlot"
        );


    if (
        !name ||
        !name.value.trim()
    ) {

        alert(
            "कृपया ग्राहक का नाम भरें।"
        );

        name.focus();

        return false;

    }


    if (
        !age ||
        age.value === ""
    ) {

        alert(
            "कृपया उम्र भरें।"
        );

        age.focus();

        return false;

    }


    const ageNumber =
        Number(
            age.value
        );


    if (
        ageNumber < 0 ||
        ageNumber > 120
    ) {

        alert(
            "कृपया सही उम्र दर्ज करें।"
        );

        age.focus();

        return false;

    }


    if (
        !service ||
        !service.value
    ) {

        alert(
            "कृपया सेवा चुनें।"
        );

        service.focus();

        return false;

    }


    if (
        !bookingDate ||
        !bookingDate.value
    ) {

        alert(
            "कृपया Booking की तारीख चुनें।"
        );

        return false;

    }


    if (
        !timeSlot ||
        !timeSlot.value
    ) {

        alert(
            "कृपया उपलब्ध Time Slot चुनें।"
        );

        timeSlot.focus();

        return false;

    }


    return true;

}


/* =========================================================
   BOOK TOKEN
========================================================= */

function bookToken() {

    /*
       FORM VALIDATION
    */

    if (
        !validateBookingForm()
    ) {

        return;

    }


    /*
       VALUES
    */

    const name =
        document.getElementById(
            "name"
        ).value.trim();


    const age =
        Number(
            document.getElementById(
                "age"
            ).value
        );


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
       CURRENT IST
    */

    const current =
        getCurrentISTDateTime();


    /*
       OFF CHECK
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
       GET BOOKINGS
    */

    const bookings =
        getBookings();


    /*
       DAILY COUNT
    */

    const dayBookings =
        bookings.filter(
            booking =>
                booking.date ===
                date
        );


    /*
       30 TOKEN LIMIT
    */

    if (
        dayBookings.length >=
        MAX_TOKENS_PER_DAY
    ) {

        alert(
            "इस तारीख के सभी 30 Token बुक हो चुके हैं।"
        );


        loadDates();


        return;

    }


    /*
       =====================================================
       MOST IMPORTANT CHECK

       SAME DATE + SAME 18 MINUTE SLOT
       DUPLICATE BOOKING NOT ALLOWED
       =====================================================
    */

    const duplicate =
        bookings.some(
            booking =>

                booking.date ===
                date &&

                booking.timeSlot ===
                timeSlot
        );


    if (
        duplicate
    ) {

        alert(

            "⚠️ यह Time Slot पहले से BOOK है।\n\n" +

            "📅 तारीख: " +
            formatDate(
                date
            ) +
            "\n" +

            "⏰ समय: " +
            timeSlot +
            "\n\n" +

            "कृपया दूसरा Time Slot चुनें।"

        );


        /*
           Slots फिर से refresh
        */

        generateTimeSlots(
            date
        );


        updateNextToken();


        return;

    }


    /*
       TOKEN NUMBER

       दिन की booking count + 1
    */

    const tokenNumber =
        "A-" +
        String(
            dayBookings.length + 1
        ).padStart(
            3,
            "0"
        );


    /*
       CREATE BOOKING
    */

    const booking = {

        id:
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8),

        token:
            tokenNumber,

        name:
            name,

        age:
            age,

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
            new Date()
                .toISOString()

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


    if (
        !saved
    ) {

        return;

    }


    /*
       SHOW TOKEN SLIP
    */

    showTokenSlip(
        booking
    );


    /*
       REFRESH DATE CARDS
    */

    loadDates();


    /*
       RESET FORM FIELDS
    */

    document
        .getElementById(
            "name"
        )
        .value = "";


    document
        .getElementById(
            "age"
        )
        .value = "";


    document
        .getElementById(
            "service"
        )
        .selectedIndex = 0;


    /*
       FORM DATE
       selected date को वापस रखना है
    */

    const bookingDate =
        document.getElementById(
            "bookingDate"
        );


    if (
        bookingDate
    ) {

        bookingDate.value =
            date;

    }


    /*
       Regenerate slots
    */

    generateTimeSlots(
        date
    );


    updateNextToken();


    /*
       SUCCESS MESSAGE
    */

    showToast(

        "🎫 Token " +
        tokenNumber +
        " successfully booked"

    );


    /*
       Scroll to slip
    */

    const slip =
        document.getElementById(
            "tokenSlip"
        );


    if (
        slip
    ) {

        setTimeout(
            function () {

                slip.scrollIntoView({
                    behavior:
                        "smooth"
                });

            },
            150
        );

    }

}


/* =========================================================
   SHOW TOKEN SLIP
========================================================= */

function showTokenSlip(
    booking
) {

    const token =
        document.getElementById(
            "tokenNumber"
        );


    const name =
        document.getElementById(
            "customerName"
        );


    const age =
        document.getElementById(
            "customerAge"
        );


    const service =
        document.getElementById(
            "customerService"
        );


    const date =
        document.getElementById(
            "customerDate"
        );


    const time =
        document.getElementById(
            "customerTime"
        );


    const bookingTime =
        document.getElementById(
            "bookingTime"
        );


    if (token) {

        token.textContent =
            booking.token;

    }


    if (name) {

        name.textContent =
            booking.name;

    }


    if (age) {

        age.textContent =
            booking.age +
            " वर्ष";

    }


    if (service) {

        service.textContent =
            booking.service;

    }


    if (date) {

        date.textContent =
            formatDate(
                booking.date
            );

    }


    if (time) {

        time.textContent =
            booking.timeSlot;

    }


    if (bookingTime) {

        bookingTime.textContent =
            formatBookingDateTime(
                booking.bookingDateTime
            );

    }

}


/* =========================================================
   UPDATE NEXT TOKEN
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


    const date =
        dateElement.value;


    const bookings =
        getBookings();


    const count =
        bookings.filter(
            booking =>
                booking.date ===
                date
        ).length;


    if (
        count >=
        MAX_TOKENS_PER_DAY
    ) {

        element.textContent =
            "FULL";

        return;

    }


    const next =
        count + 1;


    element.textContent =
        "A-" +
        String(
            next
        ).padStart(
            3,
            "0"
        );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    date
) {

    if (!date) {
        return "--";
    }


    const parts =
        date.split("-");


    const dateObject =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );


    return dateObject.toLocaleDateString(
        "hi-IN",
        {
            day:
                "2-digit",

            month:
                "long",

            year:
                "numeric"
        }
    );

}


/* =========================================================
   FORMAT BOOKING DATETIME
========================================================= */

function formatBookingDateTime(
    dateTime
) {

    if (!dateTime) {

        return "--";

    }


    const parts =
        dateTime.split(" ");


    if (
        parts.length < 2
    ) {

        return dateTime;

    }


    const date =
        parts[0];


    const time =
        parts[1];


    return (

        formatDate(
            date
        ) +

        " • " +

        formatTimeString(
            time
        ) +

        " IST"

    );

}


/* =========================================================
   FORMAT TIME STRING
========================================================= */

function formatTimeString(
    time
) {

    const parts =
        time.split(":");


    let hour =
        Number(
            parts[0]
        );


    const minute =
        parts[1];


    const second =
        parts[2] ||
        "00";


    const suffix =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12;


    if (
        hour === 0
    ) {

        hour = 12;

    }


    return (

        hour +
        ":" +
        minute +
        ":" +
        second +
        " " +
        suffix

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
        token.textContent.trim() ===
            "--"
    ) {

        alert(
            "पहले कोई Token Book करें।"
        );

        return;

    }


    window.print();

}


/* =========================================================
   DOWNLOAD TOKEN SLIP PDF
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
        token.textContent.trim() ===
            "--"
    ) {

        alert(
            "पहले कोई Token Book करें।"
        );

        return;

    }


    /*
       jsPDF + html2canvas available है तो
       PDF generate करें।
    */

    if (
        typeof html2canvas ===
            "undefined" ||
        typeof window.jspdf ===
            "undefined"
    ) {

        /*
           External library न होने पर
           print dialog से PDF save
           करने का विकल्प।
        */

        alert(

            "PDF library उपलब्ध नहीं है।\n\n" +

            "Print window खोलकर " +
            "\"Save as PDF\" चुन सकते हैं।"

        );


        window.print();


        return;

    }


    html2canvas(
        content,
        {
            scale: 2,

            backgroundColor:
                "#ffffff"
        }
    )
    .then(
        function (canvas) {

            const {
                jsPDF
            } =
                window.jspdf;


            const pdf =
                new jsPDF(
                    "p",
                    "mm",
                    "a4"
                );


            const imgData =
                canvas.toDataURL(
                    "image/png"
                );


            const pageWidth =
                pdf.internal
                    .pageSize
                    .getWidth();


            const pageHeight =
                pdf.internal
                    .pageSize
                    .getHeight();


            const margin =
                10;


            const usableWidth =
                pageWidth -
                margin * 2;


            const imageHeight =
                (
                    canvas.height *
                    usableWidth
                ) /
                canvas.width;


            let finalHeight =
                imageHeight;


            if (
                finalHeight >
                pageHeight -
                margin * 2
            ) {

                finalHeight =
                    pageHeight -
                    margin * 2;

            }


            pdf.addImage(
                imgData,
                "PNG",
                margin,
                margin,
                usableWidth,
                finalHeight
            );


            const tokenNumber =
                token.textContent
                    .trim();


            pdf.save(
                "Token-" +
                tokenNumber +
                ".pdf"
            );

        }
    )
    .catch(
        function (error) {

            console.error(
                "PDF error:",
                error
            );


            alert(
                "PDF बनाने में समस्या आई। Print करके Save as PDF करें।"
            );

        }
    );

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
            "अपना Token Number डालें।\n\nउदाहरण: A-001"
        );


    if (!token) {

        return;

    }


    const searchToken =
        token
            .trim()
            .toUpperCase();


    const booking =
        bookings.find(
            item =>
                String(
                    item.token
                ).toUpperCase() ===
                searchToken
        );


    if (!booking) {

        alert(
            "❌ यह Token नहीं मिला।"
        );

        return;

    }


    alert(

        "🎫 Token: " +
        booking.token +
        "\n\n" +

        "👤 नाम: " +
        booking.name +
        "\n" +

        "🎂 उम्र: " +
        booking.age +
        " वर्ष\n\n" +

        "🪪 सेवा: " +
        booking.service +
        "\n\n" +

        "📅 तारीख: " +
        formatDate(
            booking.date
        ) +
        "\n" +

        "⏰ समय: " +
        booking.timeSlot +
        "\n\n" +

        "📌 Status: BOOKED"

    );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    if (
        toastTimer
    ) {

        clearTimeout(
            toastTimer
        );

    }


    toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            3500
        );

}


/* =========================================================
   FIX DATE CARD DATASET
========================================================= */

/*
   Date cards create होने के बाद
   उनका actual date dataset में store करें।

   यह function loadDates() के बाद चलाया जाता है।
*/

const originalLoadDates =
    loadDates;


loadDates =
    function () {

        originalLoadDates();


        const cards =
            document.querySelectorAll(
                ".date-card"
            );


        const today =
            getCurrentISTDateTime();


        cards.forEach(
            (
                card,
                index
            ) => {

                card.dataset.date =
                    addDays(
                        today.date,
                        index
                    );

            }
        );

    };


/* =========================================================
   INITIAL DATE DATASET FIX
========================================================= */

setTimeout(
    function () {

        const cards =
            document.querySelectorAll(
                ".date-card"
            );


        if (
            cards.length
        ) {

            const today =
                getCurrentISTDateTime();


            cards.forEach(
                (
                    card,
                    index
                ) => {

                    card.dataset.date =
                        addDays(
                            today.date,
                            index
                        );

                }
            );

        }

    },
    300
);


/* =========================================================
   AUTO REFRESH
========================================================= */

/*
   हर 30 सेकंड में date cards और
   available slots refresh करें।

   इससे एक ही browser में
   booking करने के बाद status
   जल्दी update होगा।
*/

setInterval(
    function () {

        loadDates();


        const bookingDate =
            document.getElementById(
                "bookingDate"
            );


        if (
            bookingDate &&
            bookingDate.value
        ) {

            generateTimeSlots(
                bookingDate.value
            );

            updateNextToken();

        }

    },
    30000
);


/* =========================================================
   END
========================================================= */
```
