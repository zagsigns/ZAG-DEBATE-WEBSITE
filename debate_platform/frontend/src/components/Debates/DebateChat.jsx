// frontend/src/components/Debates/DebateChat.jsx

import React, { useState, useEffect, useRef } from 'react';

// NOTE: You must replace 'debate.id' with a dynamic value from the parent component
const DebateChat = ({ debateId, username }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [ws, setWs] = useState(null);
    const messagesEndRef = useRef(null); // Ref for auto-scrolling
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');
    
    // Hardcoded WebSocket URL (adjust port 8000 if your Django server runs on a different port)
    // NOTE: Replace 'localhost' with your actual backend URL in production
    const wsUrl = `ws://localhost:8000/ws/debate/${debateId}/`;

    // Effect to handle WebSocket connection lifecycle
    useEffect(() => {
        const newWs = new WebSocket(wsUrl);
        let reconnectTimeout;

        newWs.onopen = () => {
            console.log(`WebSocket connected to debate ${debateId}`);
            setConnectionStatus('Live');
            // TODO: Fetch and load the last 50 messages from the REST API here
        };

        newWs.onmessage = (e) => {
            const data = JSON.parse(e.data);
            
            // Check if it's a chat message or a signaling message
            if (data.message) {
                // Handle chat message
                setMessages(prevMessages => [...prevMessages, data]);
            } else if (data.type === 'offer' || data.type === 'answer' || data.type === 'ice') {
                // Handle WebRTC signaling messages (for the call functionality)
                console.log(`Received WebRTC signal from ${data.sender}: ${data.type}`);
                // NOTE: This signal handling logic will be fully implemented in DebateCall.jsx
            }
        };

        newWs.onclose = (e) => {
            console.warn('WebSocket closed. Attempting to reconnect...', e.code);
            setConnectionStatus('Disconnected');
            // Attempt to reconnect after a short delay
            reconnectTimeout = setTimeout(() => {
                setWs(null); // Trigger useEffect cleanup and restart
            }, 3000);
        };

        newWs.onerror = (err) => {
            console.error('WebSocket error:', err);
            newWs.close();
        };

        setWs(newWs);

        // Cleanup function
        return () => {
            clearTimeout(reconnectTimeout);
            newWs.close();
        };
    }, [debateId, wsUrl]); // Dependency array ensures reconnection if 'ws' becomes null

    // Effect for auto-scrolling to the latest message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() === '' || !ws || ws.readyState !== WebSocket.OPEN) {
            return;
        }

        const messageData = {
            message: inputMessage.trim(),
            // username is handled by the consumer, but including it here for clarity
        };

        // Send the message as a JSON string
        ws.send(JSON.stringify(messageData));
        setInputMessage('');
    };

    // --- Message Bubble Component ---
    const MessageBubble = ({ msg }) => {
        const isSelf = msg.username === username;
        const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return (
            <div className={`flex mb-4 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow-lg transition duration-300 ease-in-out ${
                    isSelf 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-gray-700 text-gray-200 rounded-tl-none'
                }`}>
                    {!isSelf && (
                        <p className="font-bold text-sm mb-1" style={{ color: isSelf ? '#fff' : '#4f46e5' }}>
                            {msg.username}
                        </p>
                    )}
                    <p className="break-words">{msg.message}</p>
                    <p className={`text-xs mt-1 ${isSelf ? 'text-indigo-200' : 'text-gray-400'} text-right`}>
                        {time}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
            
            {/* Chat Header */}
            <div className="p-3 bg-gray-700 border-b border-gray-600 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Debate Chat</h3>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    connectionStatus === 'Live' ? 'bg-green-600' : 'bg-red-600'
                } text-white`}>
                    {connectionStatus}
                </span>
            </div>

            {/* Message Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-2 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 pt-10">
                        Start the debate! Be the first to post a message.
                    </div>
                )}
                {messages.map((msg, index) => (
                    <MessageBubble key={index} msg={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-700 bg-gray-800">
                <div className="flex space-x-3">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your argument here..."
                        disabled={ws?.readyState !== WebSocket.OPEN}
                        className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={ws?.readyState !== WebSocket.OPEN || inputMessage.trim() === ''}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 disabled:bg-indigo-400"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DebateChat;