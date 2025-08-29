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
        P3: [],
        P4: []
    }
    goraChal = {
        P1: {},
        P2: {},
        P3: {},
        P4: {}
    };
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
        console.log('hello turn', value)
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
        // console.log('hey brother how you doing')
        // this.diceValue = 4;
        // this.state = STATE.DICE_ROLLED;
        this.listenDiceClick();
        this.listenResetClick();
        this.listenPieceClick();
        this.currentPosition = structuredClone(BASE_POSITIONS);


        this.setPiecesPosition("P1", 3, 31);
        this.setPiecesPosition("P1", 2, 27);
        // this.setPiecesPosition("P2", 0, 32);

        this.turn = PLAYERS[1];

    }
    listenDiceClick() {
        UI.listenDiceClick(this.onDiceClick.bind(this));
    }
    onDiceClick() {
        // console.log("Dice Clicked!", this)
        this.diceValue = 4 //1 + (Math.floor(Math.random() * 6));
        const player = this.turn;
        const playerValue = this.playerDiceValue[player];
        // this.playerDiceValue[player] = playerValue;
        // console.log("Hello player hi",playerValue)
        // console.log(this.diceValue)
        // console.log(playerValue)
        if (!playerValue) {
            return;
        }
        if (playerValue.length > 3) {
            this.playerDiceValue[player] = [];
        }
        playerValue.push(this.diceValue);


        console.log(
            'lenght player', this.playerDiceValue[player]
        );
        if (playerValue.every(v => v === 6) && playerValue.length === 3) {
            alert(`player value came three time 6`)
            this.state = STATE.DICE_NOT_ROLLED
            this.playerDiceValue[player] = [];
            this.increamentTurn();
        }
        if (playerValue[0] === 6 && playerValue[1] === 6 && playerValue[2] !== 6 && playerValue.length === 3) {
            this.state = STATE.DICE_NOT_ROLLED;
            this.checkEligiblePieces()
            this.playerDiceValue[player] = [];
        }
        if (playerValue[0] === 6 && playerValue[1] !== 6 && playerValue.length === 2) {
            this.state = STATE.DICE_NOT_ROLLED;
            this.checkEligiblePieces()
            this.playerDiceValue[player] = [];
        }
        if (playerValue[0] !== 6) {
            this.state = STATE.DICE_NOT_ROLLED;
            this.checkEligiblePieces();
        }
        this.checkEligiblePieces()
    }
    checkGoraChal(player, piece) {
        // const Player =this.currentPosition[player]
        const Chal = this.goraChal[player]
        const currentPosition = this.currentPosition[player][piece];
        // console.log(this.currentPosition[player]);
        const playerPiecesIndex = [0, 1, 2, 3].filter(p => this.currentPosition[player][p] === currentPosition);
        console.log('player index', playerPiecesIndex)
        if (playerPiecesIndex.length > 1) {
            if (!this.goraChal[player]) return;
            // console.log(currentPosition[player][piece] );
            if (!(this.goraChal[player][currentPosition] === playerPiecesIndex)) {
                const answer = confirm(`Do you want to make them in a ghora Chal situation or not ?`)
                if (answer) {
                    this.goraChal[player][currentPosition] = playerPiecesIndex
                    console.log(this.goraChal)
                }
            }
        }
        // Player.forEach(pieces => {
        //     console.log("hello",pieces);
        //     // console.log(currentPosition === pieces);
        //     if(this.goraChal[player].length===0){
        //         if (currentPosition === pieces && !(Chal.includes(pieces))) {
        //             const answer = confirm(`Do you want it to make a goraChal ?`)
        //             if (answer) {
        //                 Chal.push(player, pieces, piece),
        //                     console.log(this.goraChal);
        //             }
        //         }
        //     }else{
        //         if (currentPosition === pieces && !(Chal.includes(pieces)) && Chal.includes(player) === player) {
        //             const answer = confirm(`Do you want it to make a goraChal ?`)
        //             if (answer) {
        //                 Chal.push(player, pieces, piece),
        //                     console.log(this.goraChal);
        //             }
        //         }
        //     }


        // });
        // if (currentPosition === target) {
        // }
        // console.log('heay',Player);
        // for(let i = 0; i  <  Player.length; i++){
        //     if(currentPosition === Player[i]){
        //         const answer = confirm(`Do you want to make the gora Chal ?`)
        //         if (answer) {
        //             target = Player[i]
        //             Chal.push(player, target);
        //             console.log(Chal);
        //         }
        //     }
        // }
        if (this.goraChal[player][currentPosition] === SAFE_POSITIONS) {
            this.goraChal[player] = {};
        }
        if (this.goraChal[player][currentPosition] === HOME_ENTRANCE) {
            this.goraChal[player] = {};
        }


    }
    checkEligiblePieces() {
        const player = this.turn;

        // console.log("tell me who's going",player)
        // console.log(player)
        const eligilblePiece = this.getEligiblePiece(player);
        if (eligilblePiece.length) {
            UI.highlightPieces(player, eligilblePiece);
        } else {
            this.increamentTurn();
        }
    }
    increamentTurn() {
        // console.log("this.turn before increment:", this.turn, PLAYERS);
        const currentPlayer = PLAYERS.indexOf(this.turn);
        // console.log("currentPlayer index:", currentPlayer);
        const nextPlayer = (currentPlayer + 1) % PLAYERS.length;
        this.turn = PLAYERS[nextPlayer];
        this.state = STATE.DICE_NOT_ROLLED;
    }
    getEligiblePiece(player) {
        return [0, 1, 2, 3].filter(piece => {
            // console.log("tell me",player);
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
        // console.log("whaat are the target",target);
        if (!target.classList.contains("pad") || !target.classList.contains('highlight')) {
            return;
        }
        const player = target.getAttribute('player-id');
        const piece = target.getAttribute('piece');
        const position = this.currentPosition[player][piece];
        const checkChal = this.goraChal[player]
        const objKey = Object.keys(checkChal);
        const objValues = Object.values(checkChal)
        // console.log(Object.values(checkChal));
        if (objKey > 0) {
            // console.log('tell me whats happening here',this.goraChal[player][objKey]);
            const checkChalValues = this.goraChal[player][objKey];
            const clickPieceValue = checkChalValues.some(p => p === parseInt(piece))
            console.log("true: !", clickPieceValue );
            if (clickPieceValue) {
                this.handleGhoraChalPiece(player, checkChalValues, position)
            }
            // console.log("check chal",checkChal);
            // // console.log(checkChal['33']);
            // const chalValue = checkChalValues.filter(p => checkChalValues[p] === piece)
            // console.log('heavey',chalValue);
            // if (chalValue === piece) {
            //     this.handleGhoraChalPiece(player, piece, position)
            // }
        }
        this.handlePiece(player, piece, position);
        // console.log('Piece Click', this);
    }
    handleGhoraChalPiece(player, piece, currentPosition) {
        console.log('In Chal method',piece);
        console.log('dice Value: ', (this.diceValue % 2)===0);
        if ((this.diceValue % 2) === 0) {
            this.diceValue = (this.diceValue) / 2
            this.moveChalPiece(player, piece, this.diceValue)
        }else{

            alert("You cannot play that value here")
            return;
        }
        // const goraChalPieces = this.goraChal[player][position]
        // console.log(goraChalPieces);
        // if (currentPosition % 2) {
        //     this.movePiece(player,)
        // }
    }
    handlePiece(Player, piece, currentposition) {
        if (BASE_POSITIONS[Player].includes(currentposition)) {
            this.setPiecesPosition(Player, piece, START_POSITIONS[Player]);
            this.state = STATE.DICE_NOT_ROLLED;
            return;
        }
        UI.unhighlightPiecee();
        this.movePiece(Player, piece, this.diceValue);
        this.playerDiceValue[Player] = []
    }
    setPiecesPosition(player, piece, newPosition) {
        this.currentPosition[player][piece] = newPosition;
        UI.setPiecePosition(player, piece, newPosition);
    }
    setChalPiecesPosition(player, piece1,piece2, newPosition) {
        console.log('tell me the position of Players',newPosition.newPosition1)
        console.log(this.currentPosition[player][piece1]);
        this.currentPosition[player][piece1] = newPosition.newPosition1;
        this.currentPosition[player][piece2] = newPosition.newPosition2;
        console.log('Players positions in Chal pieces',this.currentPosition);
        UI.setChalPiecePosition(player, piece1,piece2, newPosition);
    }
    moveChalPiece(player, piece, moveby) {
        console.log("pieeeeee",piece);
        const interval = setInterval(() => {
            console.log('before method', piece)
            const newpos = this.increamentChalPiecePosition(player, piece)
            console.log("new pos in move chal",newpos);
            moveby--;
            if (moveby === 0) {
                clearInterval(interval);
                const isKill = this.checkKill(player, piece);
                if (isKill) {
                    // console.log(isKill)
                    this.state = STATE.DICE_NOT_ROLLED;
                    return;
                }
                this.increamentTurn();
                return
            }
            console.log("move by",moveby);
        },300)
    }
    movePiece(player, piece, moveby) {
        // console.log('moveBy',moveby);
        const interval = setInterval(() => {
            
            const newpos = this.increamentPiecePosition(player, piece)
            moveby--;
            if (moveby === 0) {
                clearInterval(interval);
                if (this.hasPlayerWon(player)) {
                    alert(`Player: ${player} has Won!`);
                    this.onResetClick();
                    return;
                }
                this.checkGoraChal(player, piece)


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
        // console.log("Player ",currentPosition)
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
                if (currentPosition === opponentPositions && !SAFE_POSITIONS.includes(opponentPositions) && !(this.goraChal[opponentId].includes(opponentPositions))) {
                    const opposposi = this.setPiecesPosition(opponentId, opposId, BASE_POSITIONS[opponentId][opposId]);
                    console.log('kya hal hein', opponentId);
                    kill = true;
                }
                return kill;
            }
        })
    }
    hasPlayerWon(player) {
        return [0, 1, 2, 3].every(piece =>
            this.currentPosition[player][piece] === HOME_POSITIONS[player],
        );
    }
    increamentPiecePosition(player, piece) {
        console.log("Sacam",piece);
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
    increamentChalPiecePosition(player, piece) {
        // console.log('why not working',piece)
        console.log('Method returning',this.getIncrementChalPiecePosition(player, piece));
        this.setChalPiecesPosition(player, piece[0],piece[1], this.getIncrementChalPiecePosition(player, piece))
    }
    getIncrementChalPiecePosition(player, piece) {
        console.log("player", player);
        console.log("in increament side of the ludo ", piece);
        const currentPositionBullet1 = this.currentPosition[player][piece[0]];
        const currentPositionBullet2 = this.currentPosition[player][piece[1]];
        if (currentPositionBullet1 === HOME_POSITIONS[player] && currentPositionBullet2===HOME_POSITIONS[player]) {
            return currentPosition;
        }
        else if (currentPositionBullet1 === TURNING_POINTS[player] && currentPositionBullet2 === TURNING_POINTS[player]) {
            return HOME_ENTRANCE[player][0]
        } else if (currentPositionBullet2 === 51 && currentPositionBullet1 === 51) {
            return 0;
        }
    
        const newPosition1=  currentPositionBullet1+1;
            const newPosition2=currentPositionBullet2+1;
            return{
                newPosition1,
                newPosition2
            }
        
    }
}