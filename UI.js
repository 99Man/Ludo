import { BASE_POSITIONS, STEP_LENGTH, COORDINATES_MAP, PLAYERS } from "./constants.js";

const diceButtonElement = document.querySelector('#dice');

const playerPieceNumber = {
    P1: document.querySelectorAll('.pad[player-id="P1"]'),
    P2: document.querySelectorAll('.pad[player-id="P2"]'),
    P3: document.querySelectorAll('.pad[player-id="P3"]'),
    P4: document.querySelectorAll('.pad[player-id="P4"]'),
};

// console.log(playerPieceNumber.P1);
// console.log(playerPieceNumber.P2);
// console.log(playerPieceNumber.P3);
// console.log(playerPieceNumber.P4);

export class UI {
    static listenDiceClick(callback) {
        document.querySelector('#dice').addEventListener("click", callback);
    }

    static listenResetClick(callback) {
        document.querySelector("button#reset").addEventListener("click", callback);
    }

    static listenPieceClick(callback) {
        document.querySelector(".ludo").addEventListener("click", callback);
    }

    /**
     * Moves a piece on the board
     * @param {string} player - Player ID ("P1", "P2","P3", "P4")
     * @param {Number} previousPosition - The piece index (0-3)
     * @param {Number} newPosition - The board position (from COORDINATES_MAP)
     */
    static setPiecePosition(player, previousPosition, newPosition) {
        if (!playerPieceNumber[player] || !playerPieceNumber[player][previousPosition]) {
            console.error(`❌ Player Element of this player: ${player} and piece: ${previousPosition} not found`);
            return;
        }
        if (!COORDINATES_MAP[newPosition]) {
            console.error(`❌ Invalid newPosition: ${newPosition}`);
            return;
        }

        const [x, y] = COORDINATES_MAP[newPosition];
        const pieceElement = playerPieceNumber[player][previousPosition];
        console.log("what are coming", pieceElement);

        document.querySelector('.ludo').appendChild(pieceElement);
        pieceElement.style.top = (y * STEP_LENGTH) + "%";
        pieceElement.style.left = (x * STEP_LENGTH) + "%";
        pieceElement.style.position = "absolute";
    }

    static setChalPiecePosition(player, piece1, piece2, newPosition) {
        console.log("new position", newPosition);
        const pieceString1 = piece1.toString(); //console.log(pieceString1);

        if (!playerPieceNumber[player] || !playerPieceNumber[player][piece1] || !playerPieceNumber[player][piece2]) {
            console.error(`❌ Player Element of this player: ${player} and piece: ${piece1}, ${piece2} not found`);
            return;
        }
        if (!COORDINATES_MAP[newPosition]) {
            console.error(`❌ Invalid newPosition: ${newPosition}`);
            return;
        }

        const [x, y] = COORDINATES_MAP[newPosition];
        const pieceElement = playerPieceNumber[player][previousPosition];
        console.log("what are coming", pieceElement);

        document.querySelector('.ludo').appendChild(pieceElement);
        pieceElement.style.top = (y * STEP_LENGTH) + "%";
        pieceElement.style.left = (x * STEP_LENGTH) + "%";
        pieceElement.style.position = "absolute";
    }

    static setTurn(index) {
        if (index < 0 || index >= PLAYERS.length) {
            console.error('Index is out of bound');
            return;
        }

        const playerActive = document.querySelector('.pad.highlight');
        const Player = index;
        console.log('hello player', Player);

        if (playerActive) {
            playerActive.classList.remove('highlight');
        }

        document.querySelector('.active-player span').innerText = Player;

        if (document.querySelector('.active-player span') === document.querySelector(`[player-id="${Player}"].pad`)) {
            document.querySelector(`[player-id="${Player}"].pad`).classList.add('highlight');
        }
    }

    static disableDice() {
        diceButtonElement.setAttribute('disabled', '');
    }

    static enableDice() {
        diceButtonElement.removeAttribute('disabled');
    }

    /**
     * @param {string} player
     * @param {Number[]} pieces
     */
    static highlightPieces(player, pieces) {
        pieces.forEach(piece => {
            const pieceElement = playerPieceNumber[player][piece];
            pieceElement.classList.add('highlight');
        });
    }

    static unhighlightPiecee() {
        document.querySelectorAll('.pad.highlight').forEach(ele => {
            ele.classList.remove('highlight');
        });
    }

    static setdiceValue(value) {
        document.querySelector('.dice-value').innerText = value;
    }
}

// Example move
// UI.setPiecePosition("P1", 0,0);
// UI.highlightPieces("P1",[0]);
// UI.setdiceValue(6);
// UI.unhighlightPiecee();
// UI.setTurn(0)
// UI.setTurn(1)
// UI.disableDice();
// UI.enableDice();
