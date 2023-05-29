
function compareTime(timeString1, timeString2){
    let date1 = new Date(timeString1);
    let date2 = new Date(timeString2);
    return date1.getTime() > date2.getTime();
}

module.exports = {
    compareTime,
}