# Online Simple-Tic-Tac-Toe Game 🎮

Online multiplayer Tic-Tac-Toe game! This project uses WebSocket for real-time communication between players.

## How It Works 🕹️

### Backend (Node.js with Express)

- **Server Setup**: Initializes a WebSocket server (`ws` library) to handle client connections.
- **Game Logic**: Manages game state in memory, handles player actions (`move`, `requestReset`), and broadcasts updates to clients.
- **WebSocket Communication**: Implements message types to synchronize game actions between players.

### Frontend (React)

- **Components**:
    - **App Component**: Manages game state and WebSocket connection.
    - **Board Component**: Renders the game board and handles player moves.
- **State Management**: Uses React hooks (`useState`, `useEffect`) to manage local game state and handle WebSocket events.
- **WebSocket Integration**: Establishes a connection to the backend server to send and receive game state updates in real-time.

## How to Play 🚀

1. **Initialization**:
    - Players connect to the server and receive initial game state (`init`), including their assigned symbol (`X` or `O`).

2. **Gameplay**:
    - Players take turns making moves (`move`).
    - After each move, the game checks for win conditions.
    - If a win is detected, the game notifies both players and updates the game state (`update`).

3. **Reset**:
    - Players can request to reset the game (`requestReset`).
    - Both players must agree to reset (`resetRequest` and `resetPending` messages) before the game restarts.


## Win Condition Check 🏆

- The game checks for win conditions after each move using a function that examines rows, columns, and diagonals of the board.
- If a player has achieved a winning combination, the game declares them the winner and updates the game state accordingly.

### Technologies Used 🛠️

- **Backend**: Node.js, Express, WebSocket (`ws`)
- **Frontend**: React, Material-UI (for UI components)

## Setup Instructions 🚀

To run the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AluminumPirate/simple-tic-tac-toe
   cd simple-tic-tac-toe

2. **Install dependencies & Run server**:
   ```bash
   cd api
   npm install
   npm start


3. **Install dependencies & Run UI**:
   ```bash
   cd ../app
   npm install
   npm run dev

4. **Open your browser**:
   - Navigate to the link shown to play the game.
