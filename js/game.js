import { clickCard, selectCards, startGame, initCard, gameItems, saveGame } from "./memory.js";

let gameDiv = document.getElementById('game');

selectCards();

gameItems.forEach(function (value, idx) {
    let img = document.createElement('img');
    img.id = idx;
    img.title = "card";
    img.src = value;
    
    img.addEventListener('click', function() {
        clickCard(idx);
    });
    
    gameDiv.appendChild(img);

    initCard(function(newSrc) {
        img.src = newSrc;
    });
});

document.getElementById('save').addEventListener('click', function() {
    saveGame();
});

startGame();