window.onload = function() {
    const csv = document.querySelector('#csv');
    const url = new URL(window.location.href);

    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    document.querySelector('#startDate').value = startDate;
    document.querySelector('#endDate').value = endDate;
    
    csv.href = `/download?startDate=${startDate}&endDate=${endDate}`;
}