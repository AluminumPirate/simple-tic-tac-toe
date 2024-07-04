import express from 'express';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';
import Game from './game.js';

const { Server } = WebSocket;

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

const game = new Game();
let players = {};

wss.on('connection', (ws) => {
    const playerId = uuidv4();
    let playerSymbol;

    if (!players['X']) {
        playerSymbol = 'X';
        players['X'] = { id: playerId, ws };
    } else if (!players['O']) {
        playerSymbol = 'O';
        players['O'] = { id: playerId, ws };
    } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Game is full' }));
        ws.close();
        return;
    }

    ws.send(JSON.stringify({ type: 'init', board: game.getBoard(), player: playerSymbol }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'move' && data.player === playerSymbol) {
            const result = game.makeMove(data.player, data.position);
            if (result.success) {
                Object.values(players).forEach(({ ws: clientWs }) => {
                    if (clientWs.readyState === WebSocket.OPEN) {
                        clientWs.send(JSON.stringify({ type: 'update', board: result.board, message: result.message || null, gameEnded: result.gameEnded }));
                    }
                });
            } else {
                ws.send(JSON.stringify({ type: 'error', message: result.message }));
            }
        } else if (data.type === 'requestReset') {
            game.resetRequests[playerSymbol] = true;
            const otherPlayerSymbol = playerSymbol === 'X' ? 'O' : 'X';

            if (game.resetRequests.X && game.resetRequests.O) {
                game.reset();
                players = game.randomizePlayers(players);
                Object.keys(players).forEach(symbol => {
                    if (players[symbol].ws.readyState === WebSocket.OPEN) {
                        players[symbol].ws.send(JSON.stringify({ type: 'reset', board: game.getBoard(), player: symbol }));
                    }
                });
            } else {
                if (players[otherPlayerSymbol] && players[otherPlayerSymbol].ws.readyState === WebSocket.OPEN) {
                    players[otherPlayerSymbol].ws.send(JSON.stringify({ type: 'resetRequest', player: playerSymbol }));
                }
                ws.send(JSON.stringify({ type: 'resetPending' }));
            }
        }
    });

    ws.on('close', () => {
        if (players['X'] && players['X'].id === playerId) {
            delete players['X'];
        } else if (players['O'] && players['O'].id === playerId) {
            delete players['O'];
        }
        if (Object.keys(players).length === 0) {
            game.reset();
        }
    });
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
