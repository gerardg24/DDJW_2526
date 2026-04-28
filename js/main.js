window.addEventListener("load", function() {
    function iniciarPartida(mode) {
        let alias = prompt("Introdueix el teu àlies:");
        if (alias !== null && alias !== "") {
            sessionStorage.clear();
            sessionStorage.setItem('alias', alias);
            sessionStorage.setItem('gameMode', mode);
            window.location.assign("./html/game.html");
        }
    }

    document.getElementById('play-mode1').addEventListener('click', () => iniciarPartida(1));
    document.getElementById('play-mode2').addEventListener('click', () => iniciarPartida(2));

    document.getElementById('options').addEventListener('click', function() {
        window.location.assign("./html/options.html");
    });

    document.getElementById('scores').addEventListener('click', function() {
        window.location.assign("./html/scores.html");
    });

    document.getElementById('saves').addEventListener('click', function() {
        let saves = JSON.parse(localStorage.getItem('memory_saves')) || [];
        if (saves.length === 0) {
            alert("No hi ha partides guardades.");
            return;
        }
        let llistat = "Selecciona el número de partida:\n";
        saves.forEach((s, i) => {
            llistat += `${i}: ${s.alias} - Mode ${s.gameMode} (Lvl ${s.currentLevel}) - ${s.date}\n`;
        });
        let opcio = prompt(llistat);
        if (opcio !== null && saves[opcio]) {
            sessionStorage.setItem('load', JSON.stringify(saves[opcio]));
            sessionStorage.setItem('currentSaveId', saves[opcio].id);
            sessionStorage.setItem('alias', saves[opcio].alias);
            sessionStorage.setItem('gameMode', saves[opcio].gameMode);
            window.location.assign("./html/game.html");
        }
    });

    document.getElementById('exit').addEventListener('click', function() {
        if (confirm("Segur que vols sortir?")) {
            window.close();
        }
    });
});