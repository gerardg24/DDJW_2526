const resources = ['../resources/cb.png', '../resources/co.png',
                '../resources/sb.png', '../resources/so.png',
                '../resources/tb.png', '../resources/to.png'];
const back = '../resources/back.png';

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE: 1,
  DONE: 2
});

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    flippedCards: [],
    score: 200,
    numCards: 2,
    groupSize: 2,
    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    select: function(){
        if (sessionStorage.load){ 
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.flippedCards = toLoad.flippedCards || [];
            this.score = toLoad.score;
            this.numCards = toLoad.numCards;
            this.groupSize = toLoad.groupSize;
        }
        else{ 
            this.numCards = parseInt(sessionStorage.getItem('numCards')) || 2;
            this.groupSize = parseInt(sessionStorage.getItem('groupSize')) || 2;
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
                }, 1000 + 100 * indx);
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
                    alert(`Has guanyat amb ${this.score} punts!!!!`);
                    window.location.assign("../");
                }
            } else {
                let tempCards = [...this.flippedCards];
                this.flippedCards = [];
                this.ready -= tempCards.length;
                
                setTimeout(() => {
                    tempCards.forEach(id => this.goBack(id));
                    this.ready += tempCards.length;
                }, 1000);

                this.score -= 25;
                if (this.score <= 0){
                    alert ("Has perdut");
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
            groupSize: this.groupSize
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