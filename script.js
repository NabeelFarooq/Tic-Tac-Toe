"use strict";

const Player = (sign,name) => {
    this.sign = sign;
    this.name = name;
    const getSign = () => {
        return sign;
    };
    const getName = () => {
        return name;
    };
    return { getSign , getName};
};
const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    const setField = (index, sign) => {
        if(index > board.length) return;
        board[index] = sign;
    };
    const getField = (index) => {
        if(index > board.length) return;
        return board[index];
    };
    const reset = () => {
        for(let i = 0; i < board.length; i++){
            board[i] = "";
        }
    };

    return { setField, getField, reset };
})();

const displayController = (() => {
    const fieldElements = document.querySelectorAll(".field");
    const messageElement = document.getElementById("message");
    const restartButton = document.getElementById("restart-button");

    fieldElements.forEach((field) => 
        field.addEventListener("click", (e) => {
            if(gameController.getIsOver() || e.target.textContent !== "") return;
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameboard();
        })
    );

    restartButton.addEventListener("click", (e) => {
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
        setMessageElement(`Player ${gameController.getPlayer1()}'s turn`);
    });

    const updateGameboard = () => {
        for(let i=0; i < fieldElements.length; i++){
            fieldElements[i].textContent = gameBoard.getField(i);
        }
    };

    const setResultMessage = (winner) => {
        if(winner === "Draw"){
            setMessageElement("It's a draw!");
        }else{
            setMessageElement(`Player ${winner} has won!`);
        }
    };

    const setMessageElement = (message) => {
        messageElement.textContent = message;
    }
    return { setResultMessage, setMessageElement};
})();

const gameController = (() => {
    const p1 = document.getElementById("player-1");
    const p2 = document.getElementById("player-2");
    const playerX = Player("X",getPlayer1());
    const playerO = Player("O",getPlayer2());
    let round = 1;
    let isOver = false;

    const playRound = (fieldIndex) => {
        gameBoard.setField(fieldIndex, getCurrentPlayerSign());
        if (checkWinner(fieldIndex)) {
            displayController.setResultMessage(getCurrentPlayerSign());
            isOver = true;
            return;
        }
        if(round === 9) {
            displayController.setResultMessage("Draw");
            isOver = true;
            return;
        }
        round++;
        displayController.setMessageElement(`Player ${getCurrentPlayerName}'s turn`);
    };

    const getCurrentPlayerSign = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    };
    const getCurrentPlayerName = () => {
        return round % 2 === 1 ? playerX.getName() : playerO.getName();
    };
    const checkWinner = (fieldIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        return winConditions
            .filter((combination) => combination.includes(fieldIndex))
            .some((possibleCombination) =>
                possibleCombination.every(
                    (index) => gameBoard.getField(index) === getCurrentPlayerSign()
                )
            );
    };
    const getIsOver = () => {
        return isOver;
    };

    const reset = () => {
        round = 1;
        isOver = false;
    };

    const getPlayer1 = () => {
        return p1.value;
    };
    const getPlayer2 = () => {
        return p2.value;
    };
    return {playRound, getIsOver, reset, getPlayer1, getPlayer2}
})();

