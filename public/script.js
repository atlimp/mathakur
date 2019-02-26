(() => {
    function setDownloadLink(startDate, endDate) {
        const csv = document.querySelector('#csv');
        
        csv.href = `/download?startDate=${startDate}&endDate=${endDate}`;
    }
    
    function setDate() {
        const today = new Date();

        const url = new URL(window.location.href);
    
        const startDate = url.searchParams.get('startDate');
        const endDate = url.searchParams.get('endDate');
        
        const val = today.toISOString().replace(/T.*/, '');
        
        document.querySelector('#startDate').value = startDate ? startDate : val;
        document.querySelector('#endDate').value = endDate ? endDate : val;
    }

    function init() {
        setDownloadLink();
        setDate();
    }

    window.addEventListener('load', init);
})();