addEventListener('load', function() {
    
    document.getElementById('play').addEventListener('click', function(){
        // Demanem l'àlies a l'usuari
        let alias = prompt("Introdueix el teu àlies de jugador:");

        if (alias !== null && alias !== "") {
            console.log("Àlies del jugador: " + alias);
            alert("Benvingut/da, " + alias + ". Comença la partida!");
        } else {
            console.log("El jugador no ha introduït cap àlies.");
            alert("Has de posar un nom per jugar!");
        }
    });

    document.getElementById('options').addEventListener('click', function(){
        console.error("Opció no implementada");
    });

    document.getElementById('saves').addEventListener('click', function(){
        console.error("Opció no implementada");
    });

    document.getElementById('exit').addEventListener('click', function(){
        console.warn("No es pot sortir!");
    });
});