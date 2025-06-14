import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoChatbubbles } from "react-icons/io5";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { sender: 'bot', text: 'Welcome to Investly! How can I help you today?' }
            ]);
        }
    }, [isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = async () => {
        if (input.trim() === '') return;

        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            const response = await axios.post('http://localhost:9000/chatbot', { message: input });
            const botReply = response.data.reply;
            setMessages([...newMessages, { sender: 'bot', text: botReply }]);
        } catch (error) {
            console.error('Error communicating with chatbot API', error);
            setMessages([...newMessages, { sender: 'bot', text: 'Sorry, I am having trouble connecting.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div>
            <div className="chat-icon" onClick={toggleChat}>
                <IoChatbubbles size={30} color="white" />
            </div>

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h2>Chatbot</h2>
                        <button onClick={toggleChat}>X</button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.sender === 'bot' 
                                    ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                    : msg.text
                                }
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message bot">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot; 