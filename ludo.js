import { UI } from "./UI.js"
import { BASE_POSITIONS, HOME_ENTRANCE, HOME_POSITIONS, PLAYERS, SAFE_POSITIONS, START_POSITIONS, STATE, TURNING_POINTS } from "./constants.js"

export class Ludo {
    currentPosition = {
        P1: [],
        P2: [],
        P3: [],
        P4: []
    }
    playerDiceValue = {
        P1: [],
        P2: [],
    }
    _diceValue;
    get diceValue() {
        return this._diceValue;
    }
    set diceValue(value) {
        this._diceValue = value;

        UI.setdiceValue(value);
    }

    _turn;
    set turn(value) {
        this._turn = value;
        console.log('hello turn',value)
        UI.setTurn(value);
    }
    get turn() {
        return this._turn;
    }
    _state;
    set state(value) {
        this._state = value;
        if (value === STATE.DICE_NOT_ROLLED) {
            UI.enableDice();
            UI.unhighlightPiecee();
        } else {
            UI.disableDice();
        }
    }
    get state() {
        return this._state;
    }

    constructor() {
        console.log('hey brother how you doing')
        // this.diceValue = 4;
        // this.state = STATE.DICE_ROLLED;
        this.listenDiceClick();
        this.listenResetClick();
        this.listenPieceClick();
        this.currentPosition = structuredClone(BASE_POSITIONS);

        // this.onDiceClick();
        // this.increamentTurn();
        // this.setPiecesPosition("P3", 0, 33);
        // this.setPiecesPosition("P2", 1, 32);
        // this.setPiecesPosition("P1", 0, 31);
        // this.setPiecesPosition("P1", 1, 20);
        // this.setPiecesPosition("P1", 1, HOME_ENTRANCE.P1[4]);
        // this.setPiecesPosition("P1", 0, 23);
        // this.onResetClick();
        // this.setPiecesPosition('P1', 0, HOME_ENTRANCE.P1[4]);
        // this.setPiecesPosition('P1', 1, HOME_POSITIONS.P1);
        // this.setPiecesPosition('P1', 2, HOME_POSITIONS.P1);
        // this.setPiecesPosition('P1', 3, HOME_POSITIONS.P1);
        // this.setPiecesPosition('P2', 0, HOME_ENTRANCE.P2[4]);
        // this.setPiecesPosition('P2', 1, HOME_POSITIONS.P2);
        // this.setPiecesPosition('P2', 2, HOME_POSITIONS.P2);
        // this.setPiecesPosition('P2', 3, HOME_POSITIONS.P2);
        this.turn = PLAYERS[0];
        // this.diceValue=1;
        // console.log(this.getEligiblePiece('P1'));
    }
    listenDiceClick() {
        UI.listenDiceClick(this.onDiceClick.bind(this));
    }
    onDiceClick() {
        console.log("Dice Clicked!", this)
        this.diceValue = 1 + (Math.floor(Math.random() * 6));

        this.state = STATE.DICE_ROLLED;

        this.checkEligiblePieces();
    }

    checkEligiblePieces() {
        const player = this.turn;

        console.log("tell me who's going",player)
        // console.log(player)
        const eligilblePiece = this.getEligiblePiece(player);
        if (eligilblePiece.length) {
            UI.highlightPieces(player, eligilblePiece);
        } else {
            this.increamentTurn();
        }
    }
    increamentTurn() {
        console.log("this.turn before increment:", this.turn, PLAYERS);
        const currentPlayer = PLAYERS.indexOf(this.turn);
        console.log("currentPlayer index:", currentPlayer);
        const nextPlayer = (currentPlayer + 1) % PLAYERS.length;
        this.turn = PLAYERS[nextPlayer];
        this.state = STATE.DICE_NOT_ROLLED;
    }
    getEligiblePiece(player) {
        return [0, 1, 2, 3].filter(piece => {
            console.log("tell me",player);
            const currentposition = this.currentPosition[player][piece];
            if (currentposition === HOME_POSITIONS[player]) {
                return false;
            }
            if (BASE_POSITIONS[player].includes(currentposition) && this.diceValue !== 6) {
                return false;
            }
            if (HOME_ENTRANCE[player].includes(currentposition) && this.diceValue > HOME_POSITIONS[player] - currentposition) {
                return false;
            }
            return true;
        })
    }
    listenResetClick() {
        UI.listenResetClick(this.onResetClick.bind(this))
    }
    onResetClick() {
        this.currentPosition = structuredClone(BASE_POSITIONS);
        PLAYERS.forEach(player => {
            [0, 1, 2, 3].forEach(piece => {
                this.setPiecesPosition(player, piece, this.currentPosition[player][piece])
            })
        });
        this.turn = 0;
        this.state = STATE.DICE_NOT_ROLLED;
        console.log('Reset Click', this)
    }
    listenPieceClick() {
        UI.listenPieceClick(this.onPieceClick.bind(this))
    }
    onPieceClick(event) {
        const target = event.target;
        if (!target.classList.contains("pad") || !target.classList.contains('highlight')) {
            return;
        }
        const player = target.getAttribute('player-id');
        const piece = target.getAttribute('piece');
        this.handlePiece(player, piece);
        console.log('Piece Click', this);
    }
    handlePiece(Player, piece) {
        const currentposition = this.currentPosition[Player][piece];
        if (BASE_POSITIONS[Player].includes(currentposition)) {
            this.setPiecesPosition(Player, piece, START_POSITIONS[Player]);
            this.state = STATE.DICE_NOT_ROLLED;
            return;
        }
        UI.unhighlightPiecee();
        this.movePiece(Player, piece, this.diceValue);
    }
    setPiecesPosition(player, piece, newPosition) {
        this.currentPosition[player][piece] = newPosition;
        UI.setPiecePosition(player, piece, newPosition);
    }
    movePiece(player, piece, moveby) {
        const interval = setInterval(() => {
            const newpos = this.incrementPiecePosition(player, piece)
            moveby--;
            if (moveby === 0) {
                clearInterval(interval);
                // const won = this.checkWin(player,piece)
                // if(this.diceValue === 6 || won){
                //     this.state = STATE.DICE_NOT_ROLLED;
                // }
                if (this.hasPlayerWon(player)) {
                    alert(`Player: ${player} has Won!`);
                    this.onResetClick();
                    return;
                }

                const isKill = this.checkKill(player, piece);
                if (isKill) {
                    // console.log(isKill)
                    this.state = STATE.DICE_NOT_ROLLED;
                    return;
                }
                this.increamentTurn();
            }
        }, 300);
    }
    checkKill(player, piece) {
        const currentPosition = this.currentPosition[player][piece];
        console.log("Player ",currentPosition)
        let kill = false;
        PLAYERS.forEach(opponentId => {
            // console.log("Players " + player);
            if (opponentId === player) {
                // console.log(opponentId)
                return;
            }
            for (let opposId = 1; opposId <= PLAYERS.length; opposId++) {
                
                const opponentPositions = this.currentPosition[opponentId][opposId];

                // console.log("kill vallue" + opponentPositions)
                // console.log("!SAFE_POSITIONS.includes(opponentPositions)", !SAFE_POSITIONS.includes(opponentPositions));
                // console.log("currentPosition === opponentPositions", currentPosition === opponentPositions);
                if (currentPosition === opponentPositions && !SAFE_POSITIONS.includes(opponentPositions)) {
                    const opposposi=this.setPiecesPosition(opponentId, opposId, BASE_POSITIONS[opponentId][opposId]);
                    console.log('kya hal hein',opponentId);
                    kill = true;
                }

                return kill;
            }
        })
        // [0,1,2,3].forEach(piece=>{

        // })
    }
    hasPlayerWon(player) {
        return [0, 1, 2, 3].every(piece =>
            this.currentPosition[player][piece] === HOME_POSITIONS[player],
        );
    }
    checkWin(player, piece) {
        const currentposition = this.currentPosition[player][piece];
        const pieces = this.getEligiblePiece(player);
        console.log(pieces)
        if (currentposition === HOME_POSITIONS[player] && pieces > 0) {
            return true;
        }
        return false
    }
    incrementPiecePosition(player, piece) {
        this.setPiecesPosition(player, piece, this.getIncrementPiecePosition(player, piece))
    }
    getIncrementPiecePosition(player, piece) {
        const currentPosition = this.currentPosition[player][piece];
        if (currentPosition === HOME_POSITIONS[player]) {
            return currentPosition;
        }
        else if (currentPosition === TURNING_POINTS[player]) {
            return HOME_ENTRANCE[player][0]
        } else if (currentPosition === 51) {
            return 0;
        }
        return currentPosition + 1;

    }
}