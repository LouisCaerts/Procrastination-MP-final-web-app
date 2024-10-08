"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import sendQuery from './chat.js';
import { createSupabaseClientWithClerk } from './supabase';
import { useSession, useAuth } from '@clerk/nextjs'

const explainer = `
This page contains the chat functionality of the web app.
Users must be logged in in order to access the core of the app.
`;

export function Chat() {
    /* Supabase client */
    const [supabaseClient, setSupabaseClient] = useState(null);
    const { session, isLoaded } = useSession()
    const [databaseLoaded, setDatabaseLoaded] = useState(false)

    /* Variables */
    const [messages, setMessages] = useState([]);
    const [readyToSend, setReadyToSend] = useState(false);
    const [input, setInput] = useState('');
    const router = useRouter();


    /* Functions */
    const handleReset = () => {
        //setResetting(true)
        //setChatHistory({ value: [] });
        //setIdentifyResult({ value: "None" });
        //setIdentifyId({ value: "null" });
        //setShowExitModal(true);
        router.push('/');
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();
        sendMessage(false, input);
        //flushSync(() => {
        //  sendMessage(false, input);
        //});
        setReadyToSend(true);
    };

    const sendMessage = async (gpt=false, response=input, isPrompt=false) => {
        if (JSON.stringify(response).trim() === '') return;
      
        if (!gpt && !isPrompt) {
            setMessages(messages => [{ role: 'user', content: response, isPrompt: false }, ...messages]);
            //setChatHistory({ value: [{ role: 'user', content: response, isPrompt: false }, ...messages] });
            setInput('');
        } else if (!gpt && isPrompt) {
            setMessages(messages => [{ role: 'user', content: response, isPrompt: true }, ...messages]);
            //setChatHistory({ value: [{ role: 'user', content: response, isPrompt: true }, ...messages] });
        } else {
            setMessages(messages => [{ role: 'assistant', content: response, isPrompt: false }, ...messages]);
            //setChatHistory({ value: [{ role: 'assistant', content: response, isPrompt: false }, ...messages] });
        }
    };

    async function loadData() {
        console.log("Loading data...")

        console.log("Resolving identification...")
        const { identification_result, identification_id } = await loadIdentification();

        console.log("Resolving chat...")
        await loadChat(identification_result, identification_id);

        console.log("Data loaded!")
    }

    async function loadIdentification() {
        const { data, error } = await supabaseClient
        .from('identification')
        .select()
        .order('created_at', { ascending: false })
        .limit(1);
        if (!error) {
            if (data.length == 0) return;
            else {
                console.log("IDENTIFICATION LOADED");
                return {identification_result: data[0].result, identification_id: data[0].id};
            };
        } else {
            console.error("Unable to retrieve last identification");
            return;
        }
    }

    async function loadChat(identificatiin_result, identification_id) {
        const { data, error } = await supabaseClient
        .from('chat')
        if (!error) {
            if (data.length == 0) return null;
            else {
                setLastIdentificationResult(data[0].result);
                setLastIdentificationId(data[0].id);
                console.log("IDENTIFICATION LOADED");
            }
        } else {
            console.error("Unable to retrieve last identification");
            return null;
        }
    }

    async function loadMessages() {
        return []
    }

    const setUp = () => {
        return
    };

    // Effect hooks
    useEffect(() => {
        if (readyToSend) {
            const response = sendQuery(messages.slice().reverse());
            response.then(data => {if (data.length == 0) { console.error("OpenAI failed to return content. Please try again."); } else { sendMessage(true, data) }});
            setReadyToSend(false);
        }
    }, [readyToSend]);


    // Page loading ( 1: database needs to be initialised )
    useEffect(() => {
        const loadDatabase = async () => {
              try {
                setDatabaseLoaded(false);
                if (isLoaded) {
                    const supabaseAccessToken = await session.getToken({
                        template: 'supabase',
                    });
                    setSupabaseClient(await createSupabaseClientWithClerk(supabaseAccessToken));
                    setDatabaseLoaded(true);
                }
            } catch (e) {
                console.log('Exception while fetching todos:', e);
            }
        }
        loadDatabase()
    }, [isLoaded]);

    // Page loading ( 2: load identification )
    useEffect(() => {
        if (databaseLoaded) {
            console.log("DATABASE LOADED")
            loadData();
        }
    }, [databaseLoaded]);

    // Page closing
    useEffect(() => {
        const handleUnload = (event) => {
          event.preventDefault();
          console.log('Page is closing');
          event.returnValue = ''; // Required for Chrome
        };
      
        window.addEventListener('beforeunload', handleUnload);
    }, []);


    /* html */
    return (
        <div className="d-flex flex-row w-100 h-100 py-4 px-4" suppressHydrationWarning>
            <div className="d-flex flex-column col">
                <div className="ps-2">
                    <button className="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#exitModal">
                        <i className="bi bi-stop-circle align-self-start"></i> End Conversation
                    </button>
                </div>
            </div>

            <div className="modal fade" id="exitModal" tabIndex="-1" role="dialog" aria-labelledby="exitModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exitModalLabel">Warning!</h5>
                        <button type="button" className="close custom-button-invisible" data-bs-dismiss="modal" aria-label="Close">
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
                            <span className="text" style={{ wordBreak: 'break-word' }}>{msg.content}</span>
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