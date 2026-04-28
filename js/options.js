addEventListener('load', function() {
    let numCardsInput = document.getElementById('numCards');
    let groupSizeSelect = document.getElementById('groupSize');
    let startLevelInput = document.getElementById('startLevel');
    let saveBtn = document.getElementById('save');

    numCardsInput.value = localStorage.getItem('numCards') || 2;
    groupSizeSelect.value = localStorage.getItem('groupSize') || 2;
    startLevelInput.value = localStorage.getItem('startLevel') || 1;

    saveBtn.addEventListener('click', function() {
        localStorage.setItem('numCards', numCardsInput.value);
        localStorage.setItem('groupSize', groupSizeSelect.value);
        localStorage.setItem('startLevel', startLevelInput.value);
        window.location.assign("../index.html");
    });
});