import {$} from "../library/jquery-4.0.0.slim.module.min.js";
$(function() {
    $('#play').on('click', function(){
        let alias = prompt("Introdueix el teu àlies de jugador:");

        if (alias !== null && alias !== "") {
            console.log("Àlies del jugador: " + alias);
            alert("Benvingut/da, " + alias + ". Comença la partida!");
            window.location.assign("./html/game.html");
        } else {
            console.log("El jugador no ha introduït cap àlies.");
            alert("Has de posar un nom per jugar!");
        }
    });
    $('#options').on('click', function(){ alert("Opció no implementada"); });
    $('#saves').on('click', function(){ alert("Opció no implementada"); });
    $('#exit').on('click', function(){ alert("No es pot sortir!"); });
});