addEventListener('load', function() {
    document.getElementById('play').addEventListener('click', 
    function(){
        // La teva lògica per demanar l'àlies
        let alias = prompt("Introdueix el teu àlies de jugador:");

        if (alias !== null && alias !== "") {
            console.log("Àlies del jugador: " + alias);
            alert("Benvingut/da, " + alias + ". Comença la partida!");
            
            // Lògica del professor per netejar la partida anterior i començar
            sessionStorage.removeItem('load');
            // Guardem l'àlies a la sessió per poder-lo usar a les puntuacions després
            sessionStorage.setItem('alias', alias); 
            window.location.assign("./html/game.html");
        } else {
            console.log("El jugador no ha introduït cap àlies.");
            alert("Has de posar un nom per jugar!");
        }
    });

    document.getElementById('options').addEventListener('click', 
    function(){
        window.location.assign("./html/options.html");
    });

    document.getElementById('saves').addEventListener('click', 
    function(){
        let to_load = localStorage.save;
        fetch('../php/load.php', {
            method: "POST",
            body: JSON.stringify({}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(json => to_load = (!json.error)?JSON.stringify(json.save): localStorage.save)
        .catch (err => {
            console.error(err);
            console.warn("La partida s'intentarà carregar de local");
        });

        if (!to_load) {
            alert("No hi ha cap partida a carregar");
            return;
        }
        sessionStorage.load = to_load;
        window.location.assign("./html/game.html");
    });

    document.getElementById('exit').addEventListener('click', 
    function(){
        console.warn("No es pot sortir!");
    });
});