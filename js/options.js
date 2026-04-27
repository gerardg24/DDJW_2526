addEventListener('load', function() {
    let numCardsInput = document.getElementById('numCards');
    let groupSizeSelect = document.getElementById('groupSize');
    let startLevelInput = document.getElementById('startLevel');
    let saveBtn = document.getElementById('save');

    numCardsInput.value = sessionStorage.getItem('numCards') || localStorage.getItem('numCards') || 2;
    groupSizeSelect.value = sessionStorage.getItem('groupSize') || localStorage.getItem('groupSize') || 2;
    startLevelInput.value = sessionStorage.getItem('startLevel') || localStorage.getItem('startLevel') || 1;

    saveBtn.addEventListener('click', function() {
        sessionStorage.setItem('numCards', numCardsInput.value);
        sessionStorage.setItem('groupSize', groupSizeSelect.value);
        sessionStorage.setItem('startLevel', startLevelInput.value);

        localStorage.setItem('numCards', numCardsInput.value);
        localStorage.setItem('groupSize', groupSizeSelect.value);
        localStorage.setItem('startLevel', startLevelInput.value);

        window.location.assign("../index.html");
    });
});