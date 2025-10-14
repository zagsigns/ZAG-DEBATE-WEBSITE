import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

function DebateChat({ debateId }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const chatLogRef = useRef(null);

    // 1. WebSocket Connection Setup
    useEffect(() => {
        // Use the WebSocket endpoint defined in debates/routing.py
        const newSocket = new WebSocket(
            `ws://127.0.0.1:8000/ws/debates/${debateId}/`
        );
        
        // Handle connection opening
        newSocket.onopen = () => {
            console.log('WebSocket connection established.');
        };

        // Handle incoming messages
        newSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        // Handle connection closing/errors
        newSocket.onclose = (e) => {
            console.error('Chat socket closed unexpectedly:', e);
            // Implement reconnection logic if necessary
        };

        setSocket(newSocket);

        // Cleanup function for when the component unmounts
        return () => {
            newSocket.close();
        };
    }, [debateId]);

    // Scroll to the latest message
    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [messages]);

    // 2. Sending Messages
    const sendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() === '' || !socket) return;

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                'message': inputMessage,
            }));
            setInputMessage('');
        } else {
            console.error('WebSocket not ready.');
        }
    };

    // 3. Rendering
    return (
        <div className="flex flex-col h-[70vh] bg-white rounded-xl shadow-lg border">
            {/* Chat Log */}
            <div ref={chatLogRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <p className="text-center text-gray-500 italic">Start the conversation!</p>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.username === user.username ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow ${msg.username === user.username ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-tl-none'}`}>
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
            <form onSubmit={sendMessage} className="p-4 border-t flex">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={!socket || socket.readyState !== WebSocket.OPEN}
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white p-3 rounded-r-lg font-semibold hover:bg-indigo-700 transition"
                    disabled={!socket || socket.readyState !== WebSocket.OPEN || inputMessage.trim() === ''}
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default DebateChat;