function monthAsNumberToString(num) {
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    return monthNames[num-1];
}

export default (date) => {
    let string;
    if (!date) {
        return;
    }
    let { year, month, day, modifier } = date;
    month = monthAsNumberToString(month);
    const yearAsBool = !!year;
    const monthAsBool = !!month;
    const modifierAsBool = !!modifier;
    const dayAsBool = !!day;
    if (yearAsBool && month && modifierAsBool && day) {
        string = `${year} ${month} ${modifier} ${day}`;
    } else if (yearAsBool && monthAsBool && dayAsBool && !modifierAsBool) {
        string = `${year} ${month} ${day}`;
    } else if (yearAsBool & modifierAsBool && monthAsBool && !dayAsBool) {
        string = `${year} ${modifier} ${month}`;
    } else if (yearAsBool && !modifierAsBool && monthAsBool && !dayAsBool) {
        string = `${year} ${month}`;
    } else if (yearAsBool && modifierAsBool && !monthAsBool && !dayAsBool) {
        string = `${modifier} ${year}`;
    } else if (yearAsBool && !modifierAsBool && !monthAsBool && !dayAsBool) {
        string = `${year}`;
    } else {
        string = "INVALID DATE";
    }
    return string;
}