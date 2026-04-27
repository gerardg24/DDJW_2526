const resources = ['../resources/cb.png', '../resources/co.png',
                '../resources/sb.png', '../resources/so.png',
                '../resources/tb.png', '../resources/to.png'];
const back = '../resources/back.png';

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE: 1,
  DONE: 2
});

function saveRanking(score) {
    let alias = sessionStorage.getItem('alias') || 'Anònim';
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push({ alias: alias, score: score });
    ranking.sort((a, b) => b.score - a.score);
    ranking = ranking.slice(0, 10);
    localStorage.setItem('ranking', JSON.stringify(ranking));
}

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    flippedCards: [],
    score: 200,
    numCards: 2,
    groupSize: 2,
    gameMode: 1,
    currentLevel: 1,
    penalty: 25,
    hideTime: 1000,
    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    select: function(){
        this.gameMode = parseInt(sessionStorage.getItem('gameMode')) || 1;

        if (sessionStorage.load){ 
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.flippedCards = toLoad.flippedCards || [];
            this.score = toLoad.score;
            this.numCards = toLoad.numCards;
            this.groupSize = toLoad.groupSize;
            this.gameMode = toLoad.gameMode;
            this.currentLevel = toLoad.currentLevel;
            this.penalty = toLoad.penalty;
            this.hideTime = toLoad.hideTime;
        }
        else{ 
            if (this.gameMode === 2) {
                this.currentLevel = parseInt(sessionStorage.getItem('currentLevel')) || parseInt(sessionStorage.getItem('startLevel')) || 1;
                
                this.numCards = Math.min(2 + Math.floor(this.currentLevel / 2), resources.length); 
                this.groupSize = 2 + Math.floor(this.currentLevel / 4);
                this.penalty = 25 + (this.currentLevel * 5); 
                this.hideTime = Math.max(200, 1000 - (this.currentLevel * 50)); 
                
                if (this.currentLevel > (parseInt(sessionStorage.getItem('startLevel')) || 1)) {
                    this.score = parseInt(sessionStorage.getItem('currentScore')) || 200;
                } else {
                    this.score = 200;
                    sessionStorage.setItem('currentScore', this.score);
                }
            } else {
                this.numCards = parseInt(sessionStorage.getItem('numCards')) || 2;
                this.groupSize = parseInt(sessionStorage.getItem('groupSize')) || 2;
                this.score = 200;
                this.penalty = 25;
                this.hideTime = 1000;
            }

            this.flippedCards = [];
            this.items = resources.slice();          
            shuffe(this.items);                      
            this.items = this.items.slice(0, this.numCards); 
            
            let currentItems = this.items.slice();
            for (let i = 1; i < this.groupSize; i++) {
                this.items = this.items.concat(currentItems);
            }       
            
            shuffe(this.items);
            this.states = new Array(this.items.length);
        }
    },
    start: function(){
        this.items.forEach((_,indx)=>{
            if (this.states[indx] === StateCard.DISABLE ||
                this.states[indx] === StateCard.DONE){
                this.ready++;
            }
            else{
                setTimeout(()=>{
                    this.ready++;
                    this.goBack(indx);
                }, this.hideTime + (100 * indx));
            }
        });
    },
    click: function(indx){
        if (this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length) return;
        
        this.goFront(indx);
        this.flippedCards.push(indx);

        if (this.flippedCards.length === this.groupSize) {
            let match = this.flippedCards.every(id => this.items[id] === this.items[this.flippedCards[0]]);
            
            if (match) {
                this.numCards--;
                this.flippedCards.forEach(id => this.states[id] = StateCard.DONE);
                this.flippedCards = [];
                
                if (this.numCards <= 0){
                    if (this.gameMode === 1) {
                        alert(`Has guanyat amb ${this.score} punts!!!!`);
                        window.location.assign("../");
                    } else {
                        alert(`Nivell ${this.currentLevel} superat! Punts: ${this.score}.`);
                        sessionStorage.setItem('currentLevel', this.currentLevel + 1);
                        sessionStorage.setItem('currentScore', this.score);
                        window.location.reload(); 
                    }
                }
            } else {
                let tempCards = [...this.flippedCards];
                this.flippedCards = [];
                this.ready -= tempCards.length;
                
                setTimeout(() => {
                    tempCards.forEach(id => this.goBack(id));
                    this.ready += tempCards.length;
                }, this.hideTime);

                this.score -= this.penalty;
                sessionStorage.setItem('currentScore', this.score); 
                
                if (this.score <= 0){
                    if (this.gameMode === 2) {
                        saveRanking(parseInt(sessionStorage.getItem('currentScore')) + this.penalty);
                    }
                    alert ("Has perdut");
                    sessionStorage.removeItem('currentLevel');
                    sessionStorage.removeItem('currentScore');
                    window.location.assign("../");
                }
            }
        }
    },
    save: function(){
        let to_save = JSON.stringify({
            items: this.items,
            states: this.states,
            flippedCards: this.flippedCards,
            score: this.score,
            numCards: this.numCards,
            groupSize: this.groupSize,
            gameMode: this.gameMode,
            currentLevel: this.currentLevel,
            penalty: this.penalty,
            hideTime: this.hideTime
        });
        
        let ret = false;
        fetch('../php/save.php', {
            method: "POST",
            body: to_save,
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => ret = JSON.parse(response))
        .catch (err => {});

        if (!ret) {
            localStorage.save = to_save;
        }
        window.location.assign("../");
    }
}

function shuffe(arr){
    arr.sort(function () {return Math.random() - 0.5});
}

export var gameItems;
export function selectCards() { 
    game.select();
    gameItems = game.items;
}
export function clickCard(indx){ game.click(indx); }
export function startGame(){ game.start(); }
export function initCard(callback) { 
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback); 
}
export function saveGame(){
    game.save();
}