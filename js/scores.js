addEventListener('load', function() {
    let scoreList = document.getElementById('scoreList');
    let backBtn = document.getElementById('back');
    
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];

    if (ranking.length === 0) {
        scoreList.innerHTML = "<li>Encara no hi ha puntuacions.</li>";
    } else {
        ranking.forEach(entry => {
            let li = document.createElement('li');
            li.textContent = `${entry.alias} - ${entry.score} punts`;
            scoreList.appendChild(li);
        });
    }

    backBtn.addEventListener('click', function() {
        window.location.assign("../index.html");
    });
});