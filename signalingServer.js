// ZAG DEBATE PROJECT/signalingServer.js (Node.js)

const WebSocket = require('ws');
const WSS_PORT = 8080; // This must match the port in your frontend code (webRTCHandler.js)

// Create a WebSocket Server instance
const wss = new WebSocket.Server({ port: WSS_PORT });

// Simple map to track users by debate ID
// Structure: { '1': [wsClient1, wsClient2, ...], '2': [wsClientA, ...] }
const debates = {};

console.log(`Starting Signaling Server...`);

wss.on('connection', function connection(ws, req) {
    console.log('Client connected.');

    ws.on('message', function incoming(message) {
        let data;
        try {
            data = JSON.parse(message);
        } catch (e) {
            console.error('Received invalid JSON:', message);
            return;
        }
        
        // Handle 'join' action to register the client to a debate room
        if (data.action === 'join' && data.debateId) {
            const debateId = data.debateId; 
            ws.debateId = debateId; // Attach debateId to the client's WebSocket object
            
            if (!debates[debateId]) {
                debates[debateId] = [];
            }
            debates[debateId].push(ws);
            console.log(`User joined debate ${debateId}. Total in room: ${debates[debateId].length}`);
        } 
        
        // Relay signaling messages (SDP offers/answers, and ICE Candidates)
        else if (ws.debateId) {
            const debateId = ws.debateId;
            
            // Broadcast the message to all OTHER clients in the same debate room
            if (debates[debateId]) {
                debates[debateId].forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(data));
                    }
                });
            }
        }
    });

    ws.on('close', () => {
        // Clean up when a client disconnects
        if (ws.debateId && debates[ws.debateId]) {
            // Filter out the disconnected client
            debates[ws.debateId] = debates[ws.debateId].filter(client => client !== ws);
            
            // Delete the debate entry if the room is empty
            if (debates[ws.debateId].length === 0) {
                 delete debates[ws.debateId];
                 console.log(`Debate room ${ws.debateId} closed.`);
            }
        }
        console.log('Client disconnected.');
    });

    ws.on('error', (error) => {
        console.error('WebSocket Error:', error);
    });
});

console.log(`Signaling Server running on ws://localhost:${WSS_PORT}`);