"use client";
import { useAuth, useUser, UserButton, SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react';
import sendQuery from './chat.js'

const explainer = `
This page contains the chat functionality of the web app.
Users must be logged in in order to access the core of the app.
`;

export function Chat() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [messages, setMessages] = useState([
      { user: 'User', text: 'Hello!' },
      { user: 'Bot', text: 'Hi there! How can I assist you today?' }
    ]);
    const [input, setInput] = useState('');

    const handleSendMessage = (event) => {
      event.preventDefault(); // Prevent the default form submission behavior
      sendMessage(false, input);
      const response = sendQuery(input);
      sendMessage(true, response);
    };

    const sendMessage = (gpt=false, response=input) => {
      if (input.trim() === '') return;
    
      if (!gpt) {
        setMessages([...messages, { user: 'You', text: input }]);
        setInput('');
      } else {
        setMessages([...messages, { user: 'Bot', text: response }]);
      }
    };

    return (
        <div className="main-container flex flex-col grow w-full">
        <div className="parent-container flex flex-col grow h-full">
          <div className="chat-container grow">
            <div className="chat-window" id="chat-window">
              {messages.map((msg, index) => (
                <div key={index} className="message">
                  <span className="user">{msg.user}:</span>
                  <span className="text">{msg.text}</span>
                </div>
              ))}
            </div>
            <form className="chat-input" id="gptForm" onSubmit={handleSendMessage}>
              <input
                type="text"
                id="gptInput"
                name="gptInput"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    );
}