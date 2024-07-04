import { useEffect, useState } from 'react';
import Board from './components/Board.jsx';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const App = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [ws, setWs] = useState(null);
    const [player, setPlayer] = useState(null);
    const [message, setMessage] = useState('');
    const [gameEnded, setGameEnded] = useState(false);
    const [resetPending, setResetPending] = useState(false);
    const [otherPlayerWantsReset, setOtherPlayerWantsReset] = useState(false);

    useEffect(() => {
        if (!ws) {
            const socket = new WebSocket('ws://localhost:3000');
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'init') {
                    setBoard(data.board);
                    setPlayer(data.player);
                } else if (data.type === 'update') {
                    setBoard(data.board);
                    if (data.message) {
                        setMessage(data.message);
                        setGameEnded(data.gameEnded);
                    }
                } else if (data.type === 'reset') {
                    setBoard(data.board);
                    setPlayer(data.player);
                    setMessage('');
                    setGameEnded(false);
                    setResetPending(false);
                    setOtherPlayerWantsReset(false);
                } else if (data.type === 'resetPending') {
                    setMessage('Waiting for the other player to accept the reset.');
                    setResetPending(true);
                } else if (data.type === 'resetRequest') {
                    setMessage(`Player ${data.player} wants to reset the game.`);
                    setOtherPlayerWantsReset(true);
                } else if (data.type === 'error') {
                    setMessage(data.message);
                }
            };
            setWs(socket);
        }
    }, [ws]);

    const handleMove = (position) => {
        if (ws && board[position] === null && !gameEnded) {
            ws.send(JSON.stringify({ type: 'move', player, position }));
        }
    };

    const handleReset = () => {
        if (ws) {
            ws.send(JSON.stringify({ type: 'requestReset' }));
            setMessage('Waiting for the other player to accept the reset.');
            setResetPending(true);
        }
    };

    const acceptReset = () => {
        if (ws) {
            ws.send(JSON.stringify({ type: 'requestReset' }));
            setOtherPlayerWantsReset(false);
        }
    };



    return (

        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h4" component="div">
                        Player: {player}
                    </Typography>
                </Toolbar>
            </AppBar>
            <h1></h1>
            <Board board={board} onMove={handleMove} />

            {gameEnded && !resetPending && !otherPlayerWantsReset && (
                <button onClick={handleReset}>Request Restart</button>
            )}
            {resetPending && <p>Waiting for the other player to accept the reset...</p>}
            {otherPlayerWantsReset && (
                <button onClick={acceptReset}>Accept Restart</button>
            )}


            {message && <p>{message}</p>}
        </div>
    );
};

export default App;
