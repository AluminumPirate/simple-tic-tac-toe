class Game {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.resetRequests = { X: false, O: false };
    }

    getBoard() {
        return this.board;
    }

    makeMove(player, position) {
        if (this.board[position] === null && player === this.currentPlayer) {
            this.board[position] = player;
            if (this.checkWin()) {
                return { success: true, message: `${player} wins!`, board: this.board, gameEnded: true };
            } else if (this.board.every(cell => cell !== null)) {
                return { success: true, message: 'Draw!', board: this.board, gameEnded: true };
            } else {
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                return { success: true, board: this.board, gameEnded: false };
            }
        }
        return { success: false, message: 'Invalid move' };
    }

    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern =>
            this.board[pattern[0]] &&
            this.board[pattern[0]] === this.board[pattern[1]] &&
            this.board[pattern[0]] === this.board[pattern[2]]
        );
    }

    requestReset(player) {
        this.resetRequests[player] = true;
        if (this.resetRequests.X && this.resetRequests.O) {
            this.reset();
            return true;
        }
        return false;
    }

    reset() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.resetRequests = { X: false, O: false };
    }

    randomizePlayers(players) {
        const playerSymbols = ['X', 'O'];
        const shuffledSymbols = playerSymbols.sort(() => Math.random() - 0.5);
        console.log('Randomized symbols:', shuffledSymbols);
        return {
            [shuffledSymbols[0]]: players.X,
            [shuffledSymbols[1]]: players.O,
        };
    }
}

export default Game;
