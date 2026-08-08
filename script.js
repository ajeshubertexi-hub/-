```javascript
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
                booking.date === date &&
                booking.timeSlot === timeSlot
            );

        }
    );


if (duplicate) {

    /*
       जिस समय को user ने चुना है वह पहले से booked है।
       अब अगला available slot automatically खोजें।
    */

    const availableSlot =
        getNextAvailableSlot(
            date,
            timeSlot,
            bookings
        );


    if (!availableSlot) {

        alert(
            "⚠️ यह Time Slot पहले से Book है और आगे कोई Slot उपलब्ध नहीं है।\n\n" +
            "कृपया दूसरा समय या दूसरी तारीख चुनें।"
        );


        loadTimeSlots(date);

        return;

    }


    /*
       अगला available slot select करें
    */

    timeElement.value =
        availableSlot;


    alert(
        "⚠️ " +
        timeSlot +
        " पहले से Book है।\n\n" +
        "आपके लिए अगला उपलब्ध समय चुन दिया गया है:\n\n" +
        "⏰ " +
        availableSlot
    );


    return;

}


/*
   =====================================================
   TOKEN NUMBER
   =====================================================
*/

const token =
    "A-" +
    String(
        todayBookings.length + 1
    ).padStart(
        3,
        "0"
    );
```

और `bookToken()` के बाहर यह नया function जोड़ें:

```javascript
/* =========================================================
   NEXT AVAILABLE SLOT
   ========================================================= */

function getNextAvailableSlot(
    date,
    currentSlot,
    bookings
) {

    /*
       सभी slots generate करें
    */

    const slots = [];


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


        slots.push(
            formatMinutes(start) +
            " - " +
            formatMinutes(end)
        );

    }


    /*
       Current slot का index
    */

    const currentIndex =
        slots.indexOf(
            currentSlot
        );


    /*
       अगर current slot नहीं मिला
       तो पहला available slot देखें
    */

    const startIndex =
        currentIndex >= 0
            ? currentIndex + 1
            : 0;


    /*
       आगे के सभी slots में
       पहला खाली slot खोजें
    */

    for (
        let i = startIndex;
        i < slots.length;
        i++
    ) {

        const slot =
            slots[i];


        const alreadyBooked =
            bookings.some(
                function (booking) {

                    return (
                        booking.date === date &&
                        booking.timeSlot === slot
                    );

                }
            );


        if (!alreadyBooked) {

            return slot;

        }

    }


    return null;

}
```
