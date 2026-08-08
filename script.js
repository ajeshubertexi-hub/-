```css
/* =========================================================
   KANJOULI ONLINE TOKEN
   COMPLETE style.css
========================================================= */


/* =========================================================
   RESET
========================================================= */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    margin: 0;
    padding: 0;

    font-family:
        Arial,
        "Noto Sans Devanagari",
        "Mangal",
        sans-serif;

    background: #f4f7fb;

    color: #172033;

    line-height: 1.6;

    min-height: 100vh;
}


/* =========================================================
   COMMON
========================================================= */

button,
input,
select {
    font-family: inherit;
}

button {
    cursor: pointer;
}

a {
    text-decoration: none;
}

img {
    max-width: 100%;
    display: block;
}

section {
    scroll-margin-top: 80px;
}


/* =========================================================
   HEADER
========================================================= */

header {
    width: 100%;

    background:
        linear-gradient(
            135deg,
            #064e3b 0%,
            #047857 50%,
            #059669 100%
        );

    color: #ffffff;

    padding: 15px 5%;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 20px;

    flex-wrap: wrap;

    box-shadow:
        0 4px 18px
        rgba(0, 0, 0, 0.16);
}


/* =========================================================
   BRAND
========================================================= */

.brand {
    display: flex;

    align-items: center;

    gap: 13px;

    min-width: 250px;
}

.brand-mark {
    width: 54px;

    height: 54px;

    min-width: 54px;

    border-radius: 50%;

    background: #ffffff;

    color: #047857;

    border:
        3px solid
        #facc15;

    display: flex;

    align-items: center;

    justify-content: center;

    font-size: 29px;

    font-weight: 900;

    box-shadow:
        0 3px 10px
        rgba(0, 0, 0, 0.18);
}

.brand-text {
    display: flex;

    flex-direction: column;

    gap: 1px;
}

.brand-hi {
    font-size: 21px;

    font-weight: 800;

    line-height: 1.3;
}

.brand-en {
    font-size: 14px;

    font-weight: 600;

    opacity: 0.92;

    letter-spacing: 0.2px;
}


/* =========================================================
   TOP CONTACT
========================================================= */

.top-contact {
    font-size: 16px;

    font-weight: 700;

    white-space: nowrap;

    background:
        rgba(255, 255, 255, 0.12);

    border:
        1px solid
        rgba(255, 255, 255, 0.25);

    padding: 8px 14px;

    border-radius: 8px;
}


/* =========================================================
   NAVIGATION
========================================================= */

nav {
    width: 100%;

    min-height: 55px;

    background: #ffffff;

    display: flex;

    align-items: center;

    gap: 8px;

    padding: 8px 5%;

    flex-wrap: wrap;

    position: sticky;

    top: 0;

    z-index: 1000;

    box-shadow:
        0 2px 12px
        rgba(0, 0, 0, 0.08);
}

nav a {
    color: #064e3b;

    font-size: 14px;

    font-weight: 800;

    padding: 8px 12px;

    border-radius: 7px;

    transition:
        0.2s ease;
}

nav a:hover {
    background: #dcfce7;

    color: #065f46;
}

.nav-right {
    margin-left: auto;

    color: #555555;

    font-size: 14px;

    font-weight: 700;

    padding: 6px 10px;
}


/* =========================================================
   MAIN
========================================================= */

main {
    width:
        min(1100px, 92%);

    margin:
        30px auto 45px;
}

.section {
    margin-bottom: 42px;
}


/* =========================================================
   HEADINGS
========================================================= */

h1,
h2,
h3 {
    line-height: 1.3;
}

h1 {
    color: #064e3b;
}

h2 {
    text-align: center;

    color: #064e3b;

    font-size: 28px;

    margin-bottom: 22px;
}

h3 {
    color: #064e3b;
}


/* =========================================================
   BOOKING CARD
========================================================= */

.booking-card {
    width: 100%;

    background: #ffffff;

    border-radius: 18px;

    padding: 27px;

    box-shadow:
        0 8px 32px
        rgba(0, 0, 0, 0.08);

    border:
        1px solid
        #e5e7eb;
}


/* =========================================================
   BACK BUTTON
========================================================= */

.back-btn {
    border: none;

    background: #eef2f7;

    color: #374151;

    padding: 9px 15px;

    border-radius: 8px;

    font-size: 14px;

    font-weight: 700;

    transition: 0.2s;
}

.back-btn:hover {
    background: #e2e8f0;

    transform:
        translateX(-2px);
}


/* =========================================================
   BOOKING HEADING
========================================================= */

.booking-heading {
    text-align: center;

    margin-bottom: 25px;
}

.booking-heading h1 {
    font-size: 28px;

    margin-bottom: 7px;
}

.booking-heading p {
    color: #6b7280;

    font-size: 14px;

    margin-bottom: 13px;
}


/* =========================================================
   PRESENT TIME
========================================================= */

.present-time {
    display: inline-block;

    min-width: 240px;

    padding: 9px 16px;

    background: #ecfdf5;

    color: #065f46;

    border:
        1px solid
        #a7f3d0;

    border-radius: 9px;

    font-size: 14px;

    font-weight: 800;

    line-height: 1.7;

    box-shadow:
        0 3px 10px
        rgba(5, 150, 105, 0.08);
}


/* =========================================================
   DATE STRIP WRAPPER
========================================================= */

.date-strip-wrap {
    width: 100%;

    overflow-x: auto;

    overflow-y: hidden;

    padding:
        4px 2px 13px;

    scrollbar-width: thin;
}

.date-strip-wrap::-webkit-scrollbar {
    height: 7px;
}

.date-strip-wrap::-webkit-scrollbar-track {
    background: #eef2f7;

    border-radius: 20px;
}

.date-strip-wrap::-webkit-scrollbar-thumb {
    background: #9ca3af;

    border-radius: 20px;
}


/* =========================================================
   DATE STRIP
========================================================= */

.date-strip {
    display: flex;

    gap: 11px;

    width: max-content;

    min-width: 100%;
}


/* =========================================================
   DATE CARD
========================================================= */

.date-card {
    width: 108px;

    min-width: 108px;

    min-height: 108px;

    padding: 11px 8px;

    border:
        2px solid
        #d1d5db;

    border-radius: 13px;

    background: #ffffff;

    text-align: center;

    transition:
        transform 0.2s,
        box-shadow 0.2s,
        border-color 0.2s;
}


/* AVAILABLE */

.date-card.available {
    border-color: #16a34a;

    background: #f0fdf4;

    color: #14532d;

    cursor: pointer;
}

.date-card.available:hover {
    transform:
        translateY(-3px);

    box-shadow:
        0 5px 14px
        rgba(22, 163, 74, 0.18);
}


/* FULL */

.date-card.full {
    border-color: #dc2626;

    background: #fef2f2;

    color: #991b1b;

    cursor: not-allowed;

    opacity: 0.78;
}


/* OFF */

.date-card.off {
    border-color: #9ca3af;

    background: #f3f4f6;

    color: #4b5563;

    cursor: not-allowed;

    opacity: 0.72;
}


/* SELECTED */

.date-card.selected {
    background:
        linear-gradient(
            135deg,
            #047857,
            #059669
        );

    border-color: #047857;

    color: #ffffff;

    box-shadow:
        0 5px 16px
        rgba(4, 120, 87, 0.25);
}


/* DATE CONTENT */

.date-day {
    font-size: 13px;

    font-weight: 800;

    margin-bottom: 2px;
}

.date-number {
    font-size: 27px;

    line-height: 1.15;

    font-weight: 900;
}

.date-month {
    font-size: 12px;

    margin-top: 2px;

    font-weight: 700;
}

.date-card small {
    display: block;

    font-size: 11px;

    font-weight: 800;

    margin-top: 5px;
}

.loading {
    width: 100%;

    text-align: center;

    padding: 18px;

    color: #6b7280;
}


/* =========================================================
   LEGEND
========================================================= */

.legend {
    display: flex;

    justify-content: center;

    align-items: center;

    gap: 25px;

    flex-wrap: wrap;

    margin: 19px 0;

    color: #4b5563;

    font-size: 14px;
}

.legend span {
    display: flex;

    align-items: center;

    gap: 6px;
}

.dot {
    display: inline-block;

    width: 11px;

    height: 11px;

    border-radius: 50%;
}

.dot.green {
    background: #16a34a;
}

.dot.red {
    background: #dc2626;
}

.dot.gray {
    background: #9ca3af;
}


/* =========================================================
   SELECTED DATE
========================================================= */

.selected-info {
    width: 100%;

    padding: 12px 15px;

    margin:
        0 0 20px;

    border:
        1px solid
        #a7f3d0;

    background: #ecfdf5;

    color: #065f46;

    border-radius: 10px;

    text-align: center;

    font-weight: 800;

    font-size: 14px;
}


/* =========================================================
   FORM
========================================================= */

.form-card {
    width: 100%;

    background: #f8fafc;

    border:
        1px solid
        #e5e7eb;

    border-radius: 15px;

    padding: 21px;
}

.form-grid {
    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 18px;
}

.field {
    display: flex;

    flex-direction: column;

    gap: 7px;
}

.field.full {
    grid-column:
        1 / -1;
}

.field label {
    color: #374151;

    font-size: 14px;

    font-weight: 800;
}


/* =========================================================
   INPUTS
========================================================= */

input,
select {
    width: 100%;

    min-height: 46px;

    border:
        1px solid
        #cbd5e1;

    border-radius: 9px;

    background: #ffffff;

    color: #172033;

    padding: 10px 13px;

    font-size: 15px;

    outline: none;

    transition:
        border-color 0.2s,
        box-shadow 0.2s;
}

input::placeholder {
    color: #9ca3af;
}

input:hover,
select:hover {
    border-color: #94a3b8;
}

input:focus,
select:focus {
    border-color: #059669;

    box-shadow:
        0 0 0 3px
        rgba(5, 150, 105, 0.12);
}


/* =========================================================
   TIME SLOT
========================================================= */

#timeSlot {
    font-weight: 700;
}

#timeSlot option {
    padding: 8px;
}


/* =========================================================
   NEXT TOKEN
========================================================= */

.next-token {
    width: 100%;

    min-height: 46px;

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 9px 12px;

    background: #ecfdf5;

    border:
        1px solid
        #a7f3d0;

    color: #047857;

    border-radius: 9px;

    font-weight: 900;

    text-align: center;
}


/* =========================================================
   BOOK BUTTON
========================================================= */

.book-btn {
    width: 100%;

    margin-top: 22px;

    min-height: 52px;

    padding: 13px 20px;

    border: none;

    border-radius: 10px;

    background:
        linear-gradient(
            135deg,
            #047857,
            #059669
        );

    color: #ffffff;

    font-size: 17px;

    font-weight: 900;

    box-shadow:
        0 4px 12px
        rgba(4, 120, 87, 0.18);

    transition:
        transform 0.2s,
        box-shadow 0.2s;
}

.book-btn:hover {
    transform:
        translateY(-1px);

    box-shadow:
        0 7px 18px
        rgba(4, 120, 87, 0.25);
}

.book-btn:active {
    transform:
        translateY(0);
}


/* =========================================================
   SERVICES
========================================================= */

.service-grid {
    display: grid;

    grid-template-columns:
        repeat(3, 1fr);

    gap: 20px;
}

.service-card {
    background: #ffffff;

    border:
        1px solid
        #e5e7eb;

    border-radius: 15px;

    padding: 25px;

    text-align: center;

    box-shadow:
        0 6px 22px
        rgba(0, 0, 0, 0.06);

    transition:
        transform 0.2s,
        box-shadow 0.2s;
}

.service-card:hover {
    transform:
        translateY(-3px);

    box-shadow:
        0 10px 28px
        rgba(0, 0, 0, 0.09);
}

.service-card.featured {
    border:
        2px solid
        #10b981;
}

.service-icon {
    font-size: 40px;

    line-height: 1;

    margin-bottom: 14px;
}

.service-card h3 {
    margin-bottom: 8px;

    font-size: 19px;
}

.service-card p {
    color: #6b7280;

    font-size: 14px;

    min-height: 65px;
}

.secondary-btn {
    margin-top: 15px;

    padding: 10px 18px;

    border:
        1px solid
        #047857;

    border-radius: 8px;

    background: #ffffff;

    color: #047857;

    font-weight: 800;

    transition: 0.2s;
}

.secondary-btn:hover {
    background: #ecfdf5;
}

.green-btn {
    background: #047857;

    color: #ffffff;
}

.green-btn:hover {
    background: #065f46;
}


/* =========================================================
   RULES
========================================================= */

.rules-box {
    background: #ffffff;

    border:
        1px solid
        #e5e7eb;

    border-left:
        5px solid
        #047857;

    border-radius: 10px;

    padding:
        20px 22px;

    box-shadow:
        0 5px 18px
        rgba(0, 0, 0, 0.06);
}

.rules-box p {
    margin: 8px 0;

    color: #374151;

    font-size: 15px;
}

.rules-box strong {
    color: #dc2626;
}


/* =========================================================
   TOKEN SLIP
========================================================= */

#tokenSlip {
    margin-top: 40px;
}

.slip-box {
    width: 100%;

    background: #ffffff;

    border:
        1px solid
        #e5e7eb;

    border-radius: 15px;

    padding: 25px;

    box-shadow:
        0 7px 25px
        rgba(0, 0, 0, 0.07);
}


/* =========================================================
   SLIP ACTIONS
========================================================= */

.slip-actions {
    display: flex;

    justify-content: center;

    align-items: center;

    gap: 12px;

    flex-wrap: wrap;

    margin-bottom: 22px;
}

.slip-actions button {
    min-height: 44px;

    border: none;

    border-radius: 8px;

    padding: 10px 18px;

    background: #047857;

    color: #ffffff;

    font-weight: 800;

    transition: 0.2s;
}

.slip-actions button:hover {
    background: #065f46;

    transform:
        translateY(-1px);
}


/* =========================================================
   PDF CONTENT
========================================================= */

.pdf-content {
    width: 100%;

    max-width: 650px;

    margin: 0 auto;

    padding: 27px;

    background: #ffffff;

    border:
        2px solid
        #047857;

    border-radius: 12px;

    text-align: center;
}

.slip-logo {
    width: 62px;

    height: 62px;

    margin:
        0 auto 12px;

    border-radius: 50%;

    background: #047857;

    color: #ffffff;

    border:
        3px solid
        #facc15;

    display: flex;

    align-items: center;

    justify-content: center;

    font-size: 31px;

    font-weight: 900;
}

.pdf-content h2 {
    font-size: 23px;

    margin-bottom: 5px;
}

.pdf-content h3 {
    margin-bottom: 5px;
}

.pdf-content p {
    color: #374151;

    margin: 5px 0;

    font-size: 14px;
}

.pdf-content hr {
    border: none;

    border-top:
        1px solid
        #d1d5db;

    margin:
        16px 0;
}


/* =========================================================
   BIG TOKEN
========================================================= */

.big-token {
    display: block;

    width: 100%;

    margin: 16px 0;

    padding: 12px;

    background: #ecfdf5;

    border:
        1px solid
        #a7f3d0;

    border-radius: 10px;

    color: #047857;

    font-size: 46px;

    line-height: 1.2;

    font-weight: 900;

    letter-spacing: 1px;
}


/* =========================================================
   FOOTER
========================================================= */

footer {
    width: 100%;

    margin-top: 50px;

    padding: 25px 15px;

    background: #064e3b;

    color: #ffffff;

    text-align: center;

    font-size: 14px;

    font-weight: 600;
}


/* =========================================================
   TOAST
========================================================= */

.toast {
    position: fixed;

    right: 25px;

    bottom: 25px;

    z-index: 9999;

    max-width:
        calc(100% - 50px);

    background: #064e3b;

    color: #ffffff;

    padding: 13px 18px;

    border-radius: 10px;

    box-shadow:
        0 6px 25px
        rgba(0, 0, 0, 0.22);

    font-size: 14px;

    font-weight: 700;

    opacity: 0;

    visibility: hidden;

    transform:
        translateY(15px);

    transition:
        0.25s ease;
}

.toast.show {
    opacity: 1;

    visibility: visible;

    transform:
        translateY(0);
}


/* =========================================================
   SELECTION
========================================================= */

::selection {
    background: #a7f3d0;

    color: #064e3b;
}


/* =========================================================
   SCROLLBAR
========================================================= */

::-webkit-scrollbar {
    width: 9px;

    height: 9px;
}

::-webkit-scrollbar-track {
    background: #eef2f7;
}

::-webkit-scrollbar-thumb {
    background: #94a3b8;

    border-radius: 20px;
}

::-webkit-scrollbar-thumb:hover {
    background: #64748b;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 900px) {

    .service-grid {
        grid-template-columns:
            repeat(2, 1fr);
    }

    .nav-right {
        margin-left: 0;
    }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {

    header {
        justify-content: center;

        text-align: center;

        padding:
            14px 4%;
    }


    .brand {
        justify-content: center;

        width: 100%;
    }


    .top-contact {
        width: 100%;

        text-align: center;
    }


    nav {
        padding:
            8px 3%;

        justify-content: center;
    }


    nav a {
        font-size: 13px;

        padding:
            7px 9px;
    }


    .nav-right {
        width: 100%;

        text-align: center;
    }


    main {
        width: 94%;

        margin-top: 20px;
    }


    .booking-card {
        padding: 17px;

        border-radius: 14px;
    }


    .booking-heading h1 {
        font-size: 23px;
    }


    .booking-heading p {
        font-size: 13px;
    }


    .present-time {
        width: 100%;

        min-width: 0;

        font-size: 13px;
    }


    .form-grid {
        grid-template-columns:
            1fr;

        gap: 15px;
    }


    .field.full {
        grid-column: auto;
    }


    .service-grid {
        grid-template-columns:
            1fr;
    }


    .service-card {
        padding: 22px;
    }


    .rules-box {
        padding:
            17px;
    }


    .pdf-content {
        padding: 18px;
    }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 450px) {

    .brand-mark {
        width: 48px;

        height: 48px;

        min-width: 48px;

        font-size: 25px;
    }


    .brand-hi {
        font-size: 17px;
    }


    .brand-en {
        font-size: 12px;
    }


    .top-contact {
        font-size: 14px;
    }


    nav {
        gap: 4px;
    }


    nav a {
        font-size: 12px;

        padding:
            6px 7px;
    }


    .booking-card {
        padding: 13px;
    }


    .booking-heading h1 {
        font-size: 21px;
    }


    .date-card {
        width: 96px;

        min-width: 96px;

        min-height: 100px;
    }


    .form-card {
        padding: 14px;
    }


    .book-btn {
        font-size: 15px;
    }


    .big-token {
        font-size: 38px;
    }


    .slip-box {
        padding: 14px;
    }


    .pdf-content {
        padding: 14px;
    }

}


/* =========================================================
   PRINT
========================================================= */

@media print {

    @page {
        size: A4;

        margin: 12mm;
    }


    body {
        background: #ffffff;
    }


    body * {
        visibility: hidden;
    }


    #tokenSlip,
    #tokenSlip *,
    #pdfContent,
    #pdfContent * {
        visibility: visible;
    }


    #tokenSlip {
        position: absolute;

        left: 0;

        top: 0;

        width: 100%;

        margin: 0;

        padding: 0;
    }


    #tokenSlip > h2,
    .slip-actions {
        display: none !important;
    }


    .slip-box {
        padding: 0;

        box-shadow: none;

        border: none;
    }


    #pdfContent {
        position: relative;

        left: auto;

        top: auto;

        width: 100%;

        max-width: 100%;

        border:
            2px solid
            #047857;

        box-shadow: none;

        margin: 0;
    }


    .toast {
        display: none !important;
    }

}


/* =========================================================
   END
========================================================= */
```
