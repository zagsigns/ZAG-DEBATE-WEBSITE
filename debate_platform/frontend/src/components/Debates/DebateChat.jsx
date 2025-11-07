// frontend/src/components/Debates/DebateChat.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext'; // Make sure this path is correct
// Assuming you have 'lucide-react' installed for icons
import { Send, Loader, AlertTriangle, MessageSquare } from 'lucide-react'; 

function DebateChat({ debateId }) {
    // Assuming useAuth() provides the current user's data with a 'username' field
    const { user } = useAuth();
    // Use a mock username if the user object isn't fully loaded
    const currentUsername = user?.username || 'Guest';

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');
    const chatLogRef = useRef(null);

    // 1. WebSocket Connection Setup
    useEffect(() => {
        // --- Dynamic WebSocket URL Construction ---
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        // IMPORTANT: The hardcoded host/port must match your Django Channels server
        const chatHost = '127.0.0.1:8000'; 
        
        // 🛑 FIX APPLIED HERE: Using the singular '/ws/debate/' to match your routing.py
        const WSS_URL = `${protocol}://${chatHost}/ws/debate/${debateId}/`; 
        
        const newSocket = new WebSocket(WSS_URL);
        
        setConnectionStatus('Connecting...');

        // Handle connection opening
        newSocket.onopen = () => {
            console.log('WebSocket connection established.');
            setConnectionStatus('Open');
        };

        // Handle incoming messages
        newSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        // Handle connection closing/errors
        newSocket.onclose = (e) => {
            console.error('Chat socket closed unexpectedly:', e);
            setConnectionStatus('Closed / Failed');
        };
        
        newSocket.onerror = (e) => {
            console.error('WebSocket Error:', e);
            setConnectionStatus('Error');
        };

        setSocket(newSocket);

        // Cleanup function for when the component unmounts
        return () => {
            newSocket.close();
        };
    }, [debateId]); 

    // 2. Auto-Scroll to Bottom on New Message
    useEffect(() => {
        if (chatLogRef.current) {
            // Smooth scroll for better UX
            chatLogRef.current.scrollTo({
                top: chatLogRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    // 3. Send Message Handler
    const sendMessage = (e) => {
        e.preventDefault();
        const messageToSend = inputMessage.trim();

        if (messageToSend && socket && socket.readyState === WebSocket.OPEN) {
            const messageObject = {
                username: currentUsername,
                message: messageToSend,
                timestamp: new Date().toISOString(),
            };

            // Send message to WebSocket
            socket.send(JSON.stringify(messageObject));
            
            // Clear the input field
            setInputMessage('');
        }
    };

    // Determine if the send button should be enabled
    const isSendDisabled = !socket || socket.readyState !== WebSocket.OPEN || inputMessage.trim() === '';

    // Determine connection status display
    const statusClasses = {
        'Connecting...': 'text-yellow-400',
        'Open': 'text-green-400',
        'Closed / Failed': 'text-red-400',
        'Error': 'text-red-600',
    };
    
    // Determine status icon
    const StatusIcon = {
        'Connecting...': Loader,
        'Open': MessageSquare,
        'Closed / Failed': AlertTriangle,
        'Error': AlertTriangle,
    }[connectionStatus] || Loader;


    return (
        <div className="bg-gray-800 rounded-xl shadow-2xl flex flex-col h-full border border-gray-700">
            
            {/* Chat Header/Status */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Live Chat</h3>
                <span className={`text-sm flex items-center ${statusClasses[connectionStatus] || 'text-gray-500'}`}>
                    <StatusIcon className={`w-4 h-4 mr-1 ${connectionStatus === 'Connecting...' ? 'animate-spin' : ''}`} />
                    {connectionStatus}
                </span>
            </div>

            {/* Chat Log Display Area */}
            <div 
                ref={chatLogRef} 
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ maxHeight: 'calc(100% - 130px)' }}
            >
                {messages.length === 0 && connectionStatus === 'Open' ? (
                    <p className="text-center text-gray-500 italic pt-10">Start the discussion!</p>
                ) : (
                    messages.map((msg, index) => {
                        const isMine = msg.username === currentUsername;
                        return (
                            <div 
                                key={index} 
                                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-lg ${isMine ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-tl-none'}`}>
                                    <p className={`font-semibold text-xs mb-1 ${isMine ? 'text-indigo-200' : 'text-teal-400'}`}>
                                        {isMine ? 'You' : msg.username}
                                    </p>
                                    <p className="text-sm break-words whitespace-pre-wrap">{msg.message}</p>
                                    <span className={`block text-right text-xs mt-1 ${isMine ? 'text-indigo-300' : 'text-gray-400'}`}>
                                        {/* Format time nicely */}
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
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