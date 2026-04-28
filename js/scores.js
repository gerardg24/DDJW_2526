window.addEventListener("load", function() {
    let rankingContainer = document.getElementById('ranking-list');
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];

    if (ranking.length === 0) {
        rankingContainer.innerHTML = "<li>No hi ha puntuacions encara</li>";
    } else {
        rankingContainer.innerHTML = "";
        ranking.forEach((r, i) => {
            let li = document.createElement('li');
            li.textContent = `${i + 1}. ${r.alias} - Nivell ${r.level}`;
            rankingContainer.appendChild(li);
        });
    }

    document.getElementById('back-menu').addEventListener('click', function() {
        window.location.assign("../index.html");
    });
});