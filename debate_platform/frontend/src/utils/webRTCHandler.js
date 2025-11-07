// frontend/src/utils/webRTCHandler.js

const signalingServerUrl = 'ws://localhost:8080'; // <-- ENSURE YOUR NODE SERVER RUNS ON THIS PORT

// Configuration for STUN servers (essential for NAT traversal)
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' } 
    ]
};

let peerConnection;
let localStream;
let socket;
let currentDebateId;
let resolveCallStart;

function sendSignalingMessage(message) {
    if (currentDebateId && socket && socket.readyState === WebSocket.OPEN) {
        message.debateId = currentDebateId; 
        socket.send(JSON.stringify(message));
    }
}

async function handleSignalingMessages() {
    socket.onmessage = async (message) => {
        const data = JSON.parse(message.data);
        
        try {
            if (data.sdp && peerConnection) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
                
                if (data.sdp.type === 'offer') {
                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);
                    sendSignalingMessage({ sdp: peerConnection.localDescription });
                }
            } else if (data.candidate && peerConnection) {
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        } catch (e) {
            console.error('Error handling signaling message:', e);
        }
    };
}

export async function startVoiceCall(debateId) {
    currentDebateId = debateId;

    return new Promise(async (resolve, reject) => {
        resolveCallStart = resolve;
        
        try {
            // Initialize or connect socket
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                 socket = new WebSocket(signalingServerUrl);
            }

            socket.onopen = async () => {
                console.log('Connected to signaling server');
                
                socket.send(JSON.stringify({
                    action: 'join',
                    debateId: currentDebateId
                }));

                await handleSignalingMessages();

                // Get microphone access
                localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                
                peerConnection = new RTCPeerConnection(configuration);

                localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        sendSignalingMessage({ candidate: event.candidate });
                    }
                };

                peerConnection.ontrack = (event) => {
                    // Target the audio element with the debate-specific ID
                    const remoteAudio = document.getElementById(`remote-audio-element-${currentDebateId}`);
                    if (remoteAudio && !remoteAudio.srcObject) {
                         remoteAudio.srcObject = event.streams[0];
                         console.log("Remote audio stream attached.");
                         if (resolveCallStart) resolveCallStart(true);
                    }
                };

                // Create and send initial offer
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                sendSignalingMessage({ sdp: peerConnection.localDescription });

                console.log("Voice call initialization attempt complete. Awaiting peer connection...");
                // Resolve the promise to update the component state
                if (resolveCallStart) resolveCallStart(true); 

            };
            
            socket.onerror = (err) => {
                console.error("Signaling socket error:", err);
                reject(new Error("Could not connect to signaling server."));
            };

        } catch (error) {
            console.error('Error starting voice call:', error);
            reject(error);
        }
    });
}


export function endVoiceCall() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection) {
        peerConnection.close();
    }
    if (socket) {
        socket.close();
    }
    console.log("Voice call ended.");
}