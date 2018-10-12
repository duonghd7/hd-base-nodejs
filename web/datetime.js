'use strict';

function startTime() {
    let today = new Date();
    let h = checkTime(today.getHours());
    let m = checkTime(today.getMinutes());

    document.getElementById('txt-time').innerHTML = h + ":" + m;
    document.getElementById('txt-date').innerHTML = today.toDateString();
    setTimeout(startTime, 500);
}

function checkTime(i) {
    return i < 10 ? "0" + i : i;
}