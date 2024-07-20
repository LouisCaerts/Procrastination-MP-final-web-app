"use client";
import { useAuth, useUser, UserButton, SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import sendQuery from './chat.js'

const explainer = `
This page contains the chat functionality of the web app.
Users must be logged in in order to access the core of the app.
`;

export function Chat() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [messages, setMessages] = useState([
      { role: 'user', content: 'Hello!' },
      { role: 'assistant', content: 'Hi there! How can I assist you today?' }
    ]);
    const [input, setInput] = useState('');
    const [readyToSend, setReadyToSend] = useState(false);

  useEffect(() => {
    if (readyToSend) {
      console.log(messages);
      const response = sendQuery(messages);
      response.then(data => sendMessage(true, data));
      setReadyToSend(false); // Reset the flag
    }
  }, [messages, readyToSend]);

    /*useEffect(() => {
      // Log the messages whenever they change
      console.log(messages);
    }, [messages]);*/

    const handleSendMessage = async (event) => {
      event.preventDefault(); // Prevent the default form submission behavior
      flushSync(() => {
        sendMessage(false, input);
      });
      setReadyToSend(true);
    };

    const sendMessage = async (gpt=false, response=input) => {
      console.log(typeof response)
      if (JSON.stringify(response).trim() === '') return;
    
      if (!gpt) {
        setMessages(messages => [...messages, { role: 'user', content: response }]);
        setInput('');
      } else {
        setMessages(messages => [...messages, { role: 'assistant', content: response }]);
      }
    };

    return (
        <div className="main-container flex flex-col grow w-full">
        <div className="parent-container flex flex-col grow h-full">
          <div className="chat-container grow">
            <div className="chat-window" id="chat-window">
              {messages.map((msg, index) => (
                <div key={index} className="message">
                  <span className="user">{msg.role}:</span>
                  <span className="text">{msg.content}</span>
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