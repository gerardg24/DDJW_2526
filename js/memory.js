const resources = [
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 150'><rect width='100' height='150' rx='10' fill='white' stroke='navy' stroke-width='4'/><circle cx='50' cy='75' r='35' fill='crimson'/></svg>",
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 150'><rect width='100' height='150' rx='10' fill='white' stroke='navy' stroke-width='4'/><rect x='20' y='45' width='60' height='60' fill='dodgerblue'/></svg>",
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 150'><rect width='100' height='150' rx='10' fill='white' stroke='navy' stroke-width='4'/><polygon points='50,30 20,110 80,110' fill='forestgreen'/></svg>",
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 150'><rect width='100' height='150' rx='10' fill='white' stroke='navy' stroke-width='4'/><polygon points='50,38 61,66 91,66 66,84 76,112 50,94 24,112 34,84 9,66 39,66' fill='gold'/></svg>",
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 150'><rect width='100' height='150' rx='10' fill='white' stroke='navy' stroke-width='4'/><polygon points='50,30 80,75 50,120 20,75' fill='purple'/></svg>",
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 150'><rect width='100' height='150' rx='10' fill='white' stroke='navy' stroke-width='4'/><polygon points='50,25 80,42 80,108 50,125 20,108 20,42' fill='darkorange'/></svg>"
];
const back = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 150'><rect width='92' height='142' x='4' y='4' rx='10' fill='%230f3460' stroke='%23e94560' stroke-width='8'/></svg>";
const StateCard = Object.freeze({ DISABLE: 0, ENABLE: 1, DONE: 2 });

function saveRanking(level) {
    let alias = sessionStorage.getItem('alias') || 'Anònim';
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push({ alias: alias, level: level });
    ranking.sort((a, b) => b.level - a.level);
    ranking = ranking.slice(0, 10);
    localStorage.setItem('ranking', JSON.stringify(ranking));
}

function deleteCurrentSave() {
    let saveId = sessionStorage.getItem('currentSaveId');
    if (saveId) {
        let saves = JSON.parse(localStorage.getItem('memory_saves')) || [];
        saves = saves.filter(s => s.id !== saveId);
        localStorage.setItem('memory_saves', JSON.stringify(saves));
        sessionStorage.removeItem('currentSaveId');
    }
}

var game = {
    items: [], states: [], setValue: null, ready: 0, flippedCards: [],
    score: 200, numCards: 2, groupSize: 2, gameMode: 1, currentLevel: 1,
    penalty: 25, hideTime: 1000, isLoaded: false,
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
            Object.assign(this, toLoad);
            this.isLoaded = true;
            sessionStorage.removeItem('load');
        } else { 
            if (this.gameMode === 2) {
                this.currentLevel = parseInt(sessionStorage.getItem('currentLevel')) || parseInt(localStorage.getItem('startLevel')) || 1;
                this.numCards = Math.min(2 + Math.floor(this.currentLevel / 2), resources.length); 
                this.groupSize = Math.min(2 + Math.floor(this.currentLevel / 4), 4);
                this.penalty = 25 + (this.currentLevel * 5); 
                this.hideTime = Math.max(200, 1000 - (this.currentLevel * 50)); 
                this.score = (this.currentLevel > 1) ? (parseInt(sessionStorage.getItem('currentScore')) || 200) : 200;
            } else {
                this.numCards = parseInt(localStorage.getItem('numCards')) || 2;
                this.groupSize = parseInt(localStorage.getItem('groupSize')) || 2;
                this.score = 200; this.penalty = 25; this.hideTime = 1000;
            }
            this.flippedCards = [];
            this.items = resources.slice();          
            shuffe(this.items);                      
            this.items = this.items.slice(0, this.numCards); 
            let baseItems = [...this.items];
            for (let i = 1; i < this.groupSize; i++) { this.items = this.items.concat(baseItems); }       
            shuffe(this.items);
            this.states = new Array(this.items.length).fill(StateCard.DISABLE);
        }
    },
    start: function(){
        this.items.forEach((_,indx)=>{
            if (this.isLoaded) {
                this.ready++;
                if (this.states[indx] === StateCard.ENABLE) this.goBack(indx);
                else { this.setValue && this.setValue[indx](this.items[indx]); }
            } else {
                setTimeout(()=>{ this.ready++; this.goBack(indx); }, this.hideTime + (100 * indx)); 
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
                        deleteCurrentSave();
                        alert(`Victoria! Punts: ${this.score}`);
                        window.location.assign("../index.html");
                    } else {
                        alert(`Nivell ${this.currentLevel} superat!`);
                        sessionStorage.setItem('currentLevel', this.currentLevel + 1);
                        sessionStorage.setItem('currentScore', this.score);
                        window.location.reload(); 
                    }
                }
            } else {
                let temp = [...this.flippedCards];
                this.flippedCards = [];
                this.ready -= temp.length;
                setTimeout(() => { temp.forEach(id => this.goBack(id)); this.ready += temp.length; }, this.hideTime);
                this.score -= this.penalty;
                if (this.score <= 0){
                    if (this.gameMode === 2) saveRanking(this.currentLevel);
                    deleteCurrentSave();
                    alert("Has perdut!");
                    sessionStorage.removeItem('currentLevel');
                    sessionStorage.removeItem('currentScore');
                    window.location.assign("../index.html");
                }
            }
        }
    },
    save: function(){
        let saves = JSON.parse(localStorage.getItem('memory_saves')) || [];
        let saveId = sessionStorage.getItem('currentSaveId') || ("save_" + Date.now());
        let gameState = {
            id: saveId,
            alias: sessionStorage.getItem('alias'),
            date: new Date().toLocaleString(),
            items: this.items, states: this.states, flippedCards: this.flippedCards,
            score: this.score, numCards: this.numCards, groupSize: this.groupSize,
            gameMode: this.gameMode, currentLevel: this.currentLevel,
            penalty: this.penalty, hideTime: this.hideTime
        };
        let index = saves.findIndex(s => s.id === saveId);
        if (index !== -1) saves[index] = gameState;
        else saves.push(gameState);
        localStorage.setItem('memory_saves', JSON.stringify(saves));
        sessionStorage.setItem('currentSaveId', saveId);
        window.location.assign("../index.html");
    }
}
function shuffe(arr){ arr.sort(() => Math.random() - 0.5); }
export var gameItems;
export function selectCards() { game.select(); gameItems = game.items; }
export function clickCard(indx){ game.click(indx); }
export function startGame(){ game.start(); }
export function initCard(callback) { if (!game.setValue) game.setValue = []; game.setValue.push(callback); }
export function saveGame(){ game.save(); }