// script.js

const MAX_TOKENS_PER_DAY = 30;
const TOKEN_PREFIX = "A-";

const services = [
    "New Enrollment",
    "Name Update",
    "Age Update",
    "Gender Update",
    "Address Update",
    "Biometric Update",
    "Print/Download"
];

// Center holidays: YYYY-MM-DD format
const CENTER_HOLIDAYS = [
    // "2026-08-15",
    // "2026-08-26"
];

const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
    initializeForm();
    loadServices();
    setupEvents();
    updateLanguage();
});

function initializeForm() {
    const dateInput = $("bookingDate");

    if (dateInput) {
        const today = new Date();
        dateInput.min = formatDate(today);
        dateInput.value = formatDate(today);

        checkDateAvailability();
    }

    generateTimeSlots();
}

function loadServices() {
    const serviceSelect = $("serviceType");

    if (!serviceSelect) return;

    serviceSelect.innerHTML = "";

    services.forEach(service => {
        const option = document.createElement("option");
        option.value = service;
        option.textContent = service;
        serviceSelect.appendChild(option);
    });
}

function setupEvents() {
    $("bookingDate")?.addEventListener("change", () => {
        checkDateAvailability();
        generateTimeSlots();
    });

    $("bookingForm")?.addEventListener("submit", generateToken);

    $("language")?.addEventListener("change", updateLanguage);

    $("printSlip")?.addEventListener("click", () => {
        window.print();
    });

    $("downloadSlip")?.addEventListener("click", downloadSlip);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function isSunday(dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    return date.getDay() === 0;
}

function isCenterHoliday(dateString) {
    return CENTER_HOLIDAYS.includes(dateString);
}

function checkDateAvailability() {
    const date = $("bookingDate");
    const status = $("slotStatus");

    if (!date || !status) return;

    const selectedDate = date.value;

    if (isSunday(selectedDate)) {
        status.textContent = "Sunday Holiday – Booking Closed";
        status.className = "slot-full";
        disableBooking(true);
        return;
    }

    if (isCenterHoliday(selectedDate)) {
        status.textContent = "Center Holiday – Booking Closed";
        status.className = "slot-full";
        disableBooking(true);
        return;
    }

    const count = getTokenCount(selectedDate);

    if (count >= MAX_TOKENS_PER_DAY) {
        status.textContent = "Slot Full – 30/30";
        status.className = "slot-full";
        disableBooking(true);
    } else {
        status.textContent =
            `Slot Available – ${MAX_TOKENS_PER_DAY - count} tokens remaining`;
        status.className = "slot-available";
        disableBooking(false);
    }
}

function disableBooking(disabled) {
    const button = $("generateTokenBtn");

    if (button) {
        button.disabled = disabled;
    }
}

function generateTimeSlots() {
    const timeSelect = $("bookingTime");

    if (!timeSelect) return;

    timeSelect.innerHTML = "";

    // Example automatic slots
    const startHour = 9;
    const endHour = 17;
    const interval = 15;

    for (
        let minutes = startHour * 60;
        minutes < endHour * 60;
        minutes += interval
    ) {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;

        const time = formatTime(hour, minute);

        const option = document.createElement("option");
        option.value = time;
        option.textContent = time;

        timeSelect.appendChild(option);
    }
}

function formatTime(hour, minute) {
    const suffix = hour >= 12 ? "PM" : "AM";
    let displayHour = hour % 12;

    if (displayHour === 0) displayHour = 12;

    return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function getStorageKey(date) {
    return `token_${date}`;
}

function getTokenCount(date) {
    const tokens = JSON.parse(
        localStorage.getItem(getStorageKey(date)) || "[]"
    );

    return tokens.length;
}

function getTokens(date) {
    return JSON.parse(
        localStorage.getItem(getStorageKey(date)) || "[]"
    );
}

function saveTokens(date, tokens) {
    localStorage.setItem(
        getStorageKey(date),
        JSON.stringify(tokens)
    );
}

function generateTokenNumber(date) {
    const tokens = getTokens(date);

    if (tokens.length >= MAX_TOKENS_PER_DAY) {
        return null;
    }

    const nextNumber = tokens.length + 1;

    return `${TOKEN_PREFIX}${String(nextNumber).padStart(4, "0")}`;
}

function generateToken(event) {
    event.preventDefault();

    const date = $("bookingDate")?.value;
    const time = $("bookingTime")?.value;
    const name = $("applicantName")?.value.trim();
    const age = $("age")?.value;
    const gender = $("gender")?.value;
    const address = $("address")?.value.trim();
    const service = $("serviceType")?.value;
    const declaration = $("declaration")?.checked;

    if (!date || !time || !name || !age || !gender || !address || !service) {
        alert("Please fill all required fields.");
        return;
    }

    if (!declaration) {
        alert("Please accept the declaration.");
        return;
    }

    if (isSunday(date)) {
        alert("Sunday is a holiday. Booking is not available.");
        return;
    }

    if (isCenterHoliday(date)) {
        alert("Center holiday. Booking is not available.");
        return;
    }

    const tokens = getTokens(date);

    if (tokens.length >= MAX_TOKENS_PER_DAY) {
        alert("Today's 30-token limit has been reached.");
        checkDateAvailability();
        return;
    }

    const tokenNumber = generateTokenNumber(date);

    const booking = {
        token: tokenNumber,
        office: "Aadhaar Seva Kendra Kanjoli",
        date,
        time,
        name,
        age,
        gender,
        address,
        service,
        createdAt: new Date().toISOString()
    };

    tokens.push(booking);
    saveTokens(date, tokens);

    showTokenSlip(booking);
    checkDateAvailability();
}

function showTokenSlip(booking) {
    const slip = $("tokenSlip");

    if (!slip) return;

    slip.style.display = "block";

    $("slipToken").textContent = booking.token;
    $("slipOffice").textContent = booking.office;
    $("slipDate").textContent = booking.date;
    $("slipTime").textContent = booking.time;
    $("slipName").textContent = booking.name;
    $("slipAge").textContent = booking.age;
    $("slipGender").textContent = booking.gender;
    $("slipAddress").textContent = booking.address;
    $("slipService").textContent = booking.service;

    slip.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function downloadSlip() {
    const slip = $("tokenSlip");

    if (!slip) return;

    const token = $("slipToken")?.textContent || "token";

    const slipText = `
AADHAAR SEVA KENDRA KANJOLI
ONLINE TOKEN SLIP
--------------------------------

Token No: ${token}
Date: ${$("slipDate")?.textContent || ""}
Time: ${$("slipTime")?.textContent || ""}

Applicant Name: ${$("slipName")?.textContent || ""}
Age: ${$("slipAge")?.textContent || ""}
Gender: ${$("slipGender")?.textContent || ""}
Address: ${$("slipAddress")?.textContent || ""}
Service: ${$("slipService")?.textContent || ""}

--------------------------------
Please carry required documents.
This is a token booking slip.
`;

    const blob = new Blob([slipText], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${token}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

function updateLanguage() {
    const language = $("language")?.value || "en";

    const texts = {
        en: {
            title: "Online Token Booking",
            generate: "Generate Token",
            declaration:
                "I declare that the information provided by me is correct."
        },

        hi: {
            title: "ऑनलाइन टोकन बुकिंग",
            generate: "टोकन जनरेट करें",
            declaration:
                "मैं घोषणा करता/करती हूँ कि मेरे द्वारा दी गई जानकारी सही है।"
        }
    };

    const text = texts[language];

    if (!text) return;

    if ($("pageTitle")) {
        $("pageTitle").textContent = text.title;
    }

    if ($("generateTokenBtn")) {
        $("generateTokenBtn").textContent = text.generate;
    }

    if ($("declarationText")) {
        $("declarationText").textContent = text.declaration;
    }
}
