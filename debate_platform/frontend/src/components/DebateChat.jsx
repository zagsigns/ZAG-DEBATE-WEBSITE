// frontend/src/components/Debates/DebateChat.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { Send, Loader, AlertTriangle, MessageSquare } from 'lucide-react'; 

function DebateChat({ debateId }) {
    // 1. Get user data and the token
    const { user, authToken } = useAuth(); // <--- CRITICAL: MUST GET authToken
    const currentUsername = user?.username || 'Guest';

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');
    const chatLogRef = useRef(null);

    // Auto-scroll function
    const scrollToBottom = useCallback(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, []);

    // 1. WebSocket Connection Setup
    useEffect(() => {
        // --- Dynamic WebSocket URL Construction ---
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const chatHost = '127.0.0.1:8000'; 
        
        // FIX: Include the token in the URL as a query parameter
        const token = authToken || ''; 
        const query = token ? `?token=${token}` : ''; 
        
        // Use the singular '/ws/debate/' and append the token query
        const WSS_URL = `${protocol}://${chatHost}/ws/debate/${debateId}/${query}`; 
        
        const newSocket = new WebSocket(WSS_URL);
        
        newSocket.onopen = () => {
            console.log('WebSocket connection established.');
            setConnectionStatus('Open');
        };

        newSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            // Handle both chat and signal types if they were ever merged, but for now, just chat messages
            if (data.message) {
                 setMessages((prevMessages) => [...prevMessages, data]);
            }
        };

        newSocket.onclose = (e) => {
            console.error('Chat socket closed unexpectedly:', e);
            if (e.code === 4001) {
                setConnectionStatus('Authentication Failed (4001)');
            } else if (e.code === 4003) {
                 setConnectionStatus('Forbidden (4003) - Not a participant');
            } else {
                 setConnectionStatus(`Closed (${e.code})`);
            }
        };

        newSocket.onerror = (e) => {
            console.error('WebSocket Error:', e);
            setConnectionStatus('Error');
        }

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [debateId, authToken]); // Reconnect if debateId or authToken changes

    // 2. Auto-scroll effect
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // 3. Message Sending Logic
    const sendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() === '' || !socket || socket.readyState !== WebSocket.OPEN) {
            return;
        }
        
        const messagePayload = JSON.stringify({
            'message': inputMessage.trim(),
        });
        
        socket.send(messagePayload);
        setInputMessage('');
    };
    
    // Disable send button if socket is not open or message is empty
    const isSendDisabled = !socket || socket.readyState !== WebSocket.OPEN || inputMessage.trim() === '';

    return (
        <div className="flex flex-col h-full bg-gray-900 border border-gray-700 rounded-xl shadow-2xl">
            {/* Chat Log */}
            <div ref={chatLogRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 && connectionStatus === 'Open' && (
                    <div className="text-center text-gray-500 py-10">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                        Start the debate! No messages yet.
                    </div>
                )}
                
                {/* Status Indicator */}
                {connectionStatus !== 'Open' && (
                     <div className="text-center text-sm py-2 px-4 bg-yellow-900/50 text-yellow-300 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        {connectionStatus} - Please ensure you are logged in and a debate participant.
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        // Determine if the message is from the current user
                        className={`flex ${msg.username === currentUsername ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-md ${msg.username === currentUsername 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-gray-700 text-gray-100 rounded-tl-none'}`
                        }>
                            <p className="font-semibold text-xs opacity-80">{msg.username}</p>
                            <p className="text-sm break-words">{msg.message}</p>
                            <span className="block text-right text-xs mt-1 opacity-70">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-700 flex bg-gray-900 rounded-b-xl">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                        connectionStatus === 'Open' 
                            ? 'Type your message...' 
                            : `Connection Status: ${connectionStatus}`
                    }
                    className="flex-1 p-3 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-2 border-transparent focus:border-indigo-500 transition duration-150"
                    disabled={isSendDisabled}
                />
                <button
                    type="submit"
                    className={`p-3 rounded-r-lg font-semibold transition duration-150 flex items-center ${
                        isSendDisabled 
                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                    disabled={isSendDisabled}
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}

export default DebateChat;