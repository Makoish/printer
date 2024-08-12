

function filterTransactionsByTime(filter) {
    const today = new Date();
    let startDate;
    let endDate;

    if (filter === 'day') {
        // Daily filter
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
    } else if (filter === 'month') {
        // Monthly filter
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (filter === 'year') {
        // Yearly filter
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
    } 
    return {startDate, endDate}
}



x= filterTransactionsByTime("month")
console.log(x)