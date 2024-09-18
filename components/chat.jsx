"use client";
import { useAuth, useUser, UserButton, SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import sendQuery from './chat.js'
import Link from 'next/link';
import { useData } from './data-context.js';
import { useRouter } from 'next/navigation';

const explainer = `
This page contains the chat functionality of the web app.
Users must be logged in in order to access the core of the app.
`;

export function Chat() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [input, setInput] = useState('');
    const [readyToSend, setReadyToSend] = useState(false);
    const { chatHistory, setChatHistory, identifyResult, setIdentifyResult } = useData();
    const [finalAnswer, setFinalAnswer] = useState("none");
    const [loading, setLoading] = useState(true);
    const [loadingFailed, setLoadingFailed] = useState(false);
    const [promptSent, setPromptSent] = useState(false);
    const [messages, setMessages] = useState([]);
    const router = useRouter();

    const [showExitModal, setShowExitModal] = useState(false);
    const handleShowExitModal = () => setShowExitModal(true);
    const handleCloseExitModal = () => setShowExitModal(false);

    useEffect(() => {
        if (chatHistory && chatHistory.value && Array.isArray(chatHistory.value) && chatHistory.value.length > 0) {
            setMessages(messages => chatHistory.value);
            setLoadingFailed(false);
        } 
        else if (identifyResult && identifyResult.value && identifyResult.value != "none" && !promptSent) {
            setFinalAnswer(identifyResult);
            const prompt = "You are about to chat to a user and this message is just so you understand the context and will not be displayed to that user.\
                            The user took a quiz and their final result was \"" + identifyResult.value + "\".\
                            All you have to do is greet the user, repeat their final result, and explain what it could mean in the context of reasons for procrastination.\
                            Finally, just invite them to give their own thoughts."
            sendMessage(false, prompt, true);
            setPromptSent(true);
            setReadyToSend(true);
            setLoadingFailed(false);
        }
        else {
            setLoadingFailed(true);
        }
        setLoading(false);
    }, [chatHistory, identifyResult]);

    useEffect(() => {
        if (readyToSend) {
            const response = sendQuery(messages.slice().reverse());
            response.then(data => sendMessage(true, data));
            setReadyToSend(false); // Reset the flag
        }
    }, [readyToSend]);

    const handleSendMessage = async (event) => {
      event.preventDefault(); // Prevent the default form submission behavior
      flushSync(() => {
        sendMessage(false, input);
      });
      setReadyToSend(true);
    };

    const sendMessage = async (gpt=false, response=input, isPrompt=false) => {
      if (JSON.stringify(response).trim() === '') return;
    
      if (!gpt && !isPrompt) {
        setMessages(messages => [{ role: 'user', content: response, isPrompt: false }, ...messages]);
        setChatHistory({ value: [{ role: 'user', content: response, isPrompt: false }, ...messages] });
        setInput('');
      } else if (!gpt && isPrompt) {
        setMessages(messages => [{ role: 'user', content: response, isPrompt: true }, ...messages]);
        setChatHistory({ value: [{ role: 'user', content: response, isPrompt: true }, ...messages] });
      } else {
        setMessages(messages => [{ role: 'assistant', content: response, isPrompt: false }, ...messages]);
        setChatHistory({ value: [{ role: 'assistant', content: response, isPrompt: false }, ...messages] });
      }
      
    };

    const handleReset = () => {
        setChatHistory({ value: [] });
        setIdentifyResult({ value: "none" });
        setShowExitModal(true);
        router.push('/');
    };

    if (loadingFailed) {
        return (
          <div className="d-flex flex-column align-items-center justify-content-center w-100 text-center">
            <p>Loading the chat interface has failed.</p>
            <p>Please return to the home screen and either quick select your current procrastination-related issue or take the questionnaire again.</p>
            <Link href="/" className="inline-block px-1.5 py-1 transition hover:opacity-80 sm:px-3 sm:py-2" >
                <button className="" onClick={handleReset}>
                    <i className="bi bi-house custom-icon-normal align-self-start"></i>
                </button>
            </Link>
          </div>
        );
    }

    if (loading) {
        return (
          <div className="d-flex align-items-center justify-content-center w-100 text-center">
            <p>Loading...</p>
          </div>
        );
    }

    return (
      <div className="d-flex flex-row w-100 h-100 py-4 px-4" suppressHydrationWarning>
        <div className="d-flex flex-column col">
          <div className="ps-2">
            <button className="custom-button-invisible" type="button" data-bs-toggle="modal" data-bs-target="#exitModal">
                <i className="bi bi-stop-circle custom-icon-normal align-self-start"></i>
            </button>
          </div>
        </div>

        <div className="modal fade" id="exitModal" tabIndex="-1" role="dialog" aria-labelledby="exitModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exitModalLabel">Warning!</h5>
                    <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    You are about to permanently end this conversation.
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exitModal" onClick={handleReset}>Confirm</button>
                </div>
                </div>
            </div>
        </div>

        <div className="d-flex flex-column col-8 justify-content-end">
          <div className="d-flex flex-column-reverse overflow-auto my-3" id="chat-window">
            {messages.filter(msg => !msg.isPrompt).map((msg, index) => (
              <div key={index} className={`${msg.role === 'user' ? 'custom-message-user' : 'custom-message-assistant'}`}>
                {/* <span className="user">{msg.role}:</span> */}
                <span className="text">{msg.content}</span>
              </div>
            ))}
          </div>
          <form className="d-flex justify-content-center" id="gptForm" onSubmit={handleSendMessage}>
            <textarea
              className="flex-grow-1 no-resize"
              id="gptInput"
              name="gptInput"
              placeholder="Type your message..."
              rows="3"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault(); // Prevent the default newline behavior
                  const submitButton = document.getElementById('chat-submit-button');
                  if (submitButton) {
                    submitButton.click(); // Trigger the submit button click
                  }
                }
              }}
              required/>
            <button className='custom-button-invisible' type="submit" id="chat-submit-button"></button>
          </form>
        </div>

        <div className="d-flex flex-column col justify-content-end">
          <div className="ps-2">
            <button className="custom-button-invisible" onClick={() => {
              const submitButton = document.getElementById('chat-submit-button');
              if (submitButton) {
                submitButton.click(); // Trigger the submit button click
              }
            }}>
              <i className="bi bi-send custom-icon-normal"></i>
            </button>
          </div>
        </div>

      </div>
    );
}