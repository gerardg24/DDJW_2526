addEventListener('load', function() {
    
    function iniciarPartida(mode) {
        let alias = prompt("Introdueix el teu àlies de jugador:");

        if (alias !== null && alias !== "") {
            console.log("Àlies del jugador: " + alias + " - Mode: " + mode);
            
            sessionStorage.removeItem('load');
            
            sessionStorage.setItem('alias', alias);
            sessionStorage.setItem('gameMode', mode); 
            
            alert("Benvingut/da, " + alias + ". Comença la partida al Mode " + mode + "!");
            window.location.assign("./html/game.html");
        } else {
            alert("Has de posar un nom per jugar!");
        }
    }

    document.getElementById('play-mode1').addEventListener('click', function() {
        iniciarPartida(1);
    });

    document.getElementById('play-mode2').addEventListener('click', function() {
        iniciarPartida(2);
    });

    document.getElementById('scores').addEventListener('click', function() {
        window.location.assign("./html/scores.html");
    });

    document.getElementById('options').addEventListener('click', function() {
        window.location.assign("./html/options.html");
    });

    document.getElementById('saves').addEventListener('click', function() {
        let to_load = localStorage.save;
        
        fetch('../php/load.php', {
            method: "POST",
            body: JSON.stringify({}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(json => {
            to_load = (!json.error) ? JSON.stringify(json.save) : localStorage.save;
            if (to_load) {
                sessionStorage.load = to_load;
                window.location.assign("./html/game.html");
            } else {
                alert("No hi ha cap partida a carregar");
            }
        })
        .catch(err => {
            console.warn("No s'ha pogut connectar amb PHP, provant local...");
            if (to_load) {
                sessionStorage.load = to_load;
                window.location.assign("./html/game.html");
            } else {
                alert("No hi ha cap partida a carregar en local");
            }
        });
    });

    document.getElementById('exit').addEventListener('click', function() {
        if(confirm("Segur que vols sortir?")) {
            console.log("Sortint del joc...");
        }
    });
});