"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import sendQuery from './chat.js';
import sendQuerySummary from './chat_summary.js';
import { createSupabaseClientWithClerk } from './supabase';
import { useSession, useAuth } from '@clerk/nextjs'
import { useData } from './data-context';
import prompts from 'data/prompts.json';
import Link from 'next/link';

const explainer = `
This page contains the chat functionality of the web app.
Users must be logged in in order to access the core of the app.
`;

export function Chat() {
    /* Supabase client */
    const [supabaseClient, setSupabaseClient] = useState(null);
    const { session, isLoaded } = useSession()
    const [databaseLoaded, setDatabaseLoaded] = useState(false)
    const [chatIdentifier, setChatIdentifier] = useState(-1)

    /* Variables */
    const [messages, setMessages] = useState([]);
    const [readyToSend, setReadyToSend] = useState(false);
    const [fatalError, setFatalError] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [input, setInput] = useState('');
    const router = useRouter();
    const { chatId, setChatId } = useData();


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

    const sendMessage = async (gpt=false, response=input, isPrompt=false, chat_id=chatIdentifier) => {
        if (JSON.stringify(response).trim() === '') return;
      
        // front end update
        if (!gpt && !isPrompt) {
            setMessages(messages => [{ role: 'user', content: response, isPrompt: false }, ...messages]);
            setInput('');
        } else if (!gpt && isPrompt) {
            setMessages(messages => [{ role: 'user', content: response, isPrompt: true }, ...messages]);
        } else {
            setMessages(messages => [{ role: 'assistant', content: response, isPrompt: false }, ...messages]);
        }

        // back end update
        const role = gpt ? "assistant" : "user";

        uploadMessage(role, response, isPrompt, chat_id);
    };

    async function uploadMessage(role, content, isPrompt, chat_id) {
        const { data, error } = await supabaseClient.from('message').insert({ role: role, content: content, isPrompt: isPrompt, chat_id: chat_id }).select('id')
        if (error) {
            console.error('Error inserting new message:', error);
            setUploadError(true);
        }
    
        if (data && data.length > 0 && data[0].id) {
            console.log("NEW MESSAGE ID = ", data[0].id)
        }
    }

    async function loadData() {
        console.log("Loading data...");

        console.log("Loading chat entity...");
        const { chat_id, chat_intervention } =  await loadChat();
        setChatIdentifier(chat_id);

        console.log("Loading message entities...");
        const { messages } =  await loadMessages(chat_id);
        console.log("Messages: ", messages);

        if (messages.length == 0) {
            prompt = prompts[chat_intervention];
            await sendMessage(false, prompt, true, chat_id);
            setReadyToSend(true);
        }
        else {
            setMessages(messages);
        }

        console.log("Data loaded!")
    }

    async function loadChat() {
        const { data, error } = await supabaseClient
        .from('chat')
        .select()
        .order('start', { ascending: false })
        .limit(1);
        if (!error) {
            if (data.length == 0) { setFatalError(true); return null; }
            else {
                console.log("Chat entity loaded!");
                return {chat_id: data[0].id, chat_intervention: data[0].intervention};
            }
        } else {
            console.error("Unable to retrieve last chat entity.");
            setFatalError(true);
            return {chat_id: null, chat_intervention: null};
        }
    }

    async function loadMessages(chat_id) {
        const { data, error } = await supabaseClient
        .from('message')
        .select('role,content,isPrompt')
        .eq('chat_id', chat_id)
        .order('send_time', { ascending: false });
        if (!error) {
            console.log("Message entities loaded!");
            return {messages: data};
        } else {
            console.error("Unable to retrieve message entities.");
            setFatalError(true);
            return {messages: null};
        }
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
                    setSupabaseClient(createSupabaseClientWithClerk(supabaseAccessToken));
                    setDatabaseLoaded(true);
                }
            } catch (e) {
                console.log('Exception while fetching todos:', e);
            }
        }
        loadDatabase();
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

    if (fatalError) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center w-100 text-center">
              <p>Loading the chat has failed.</p>
              <p>Please return to the home screen and take the questionnaire again or contact Louis.Caerts@gmail.com.</p>
              <Link href="/" className="inline-block px-1.5 py-1 transition hover:opacity-80 sm:px-3 sm:py-2" >
                  <button className="" onClick={handleReset}>
                      <i className="bi bi-house custom-icon-normal align-self-start"></i>
                  </button>
              </Link>
            </div>
        );
    }

    return (
        <div className="d-flex flex-row w-100 py-2 justify-content-center" suppressHydrationWarning>
            
            <div className="d-flex flex-column col-2 justify-content-left align-items-left">
                <div className="ps-2 pt-2">
                    <button className="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#exitModal">
                        Stop
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
                        You are about to end this conversation.
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exitModal" onClick={handleReset}>Confirm</button>
                    </div>
                    </div>
                </div>
            </div>

            <div className="d-flex flex-column col-10 col-md-8 px-1 justify-content-end">
                <div className="d-flex flex-column-reverse overflow-auto my-3" id="chat-window">
                    {messages.filter(msg => !msg.isPrompt).map((msg, index) => (
                        <div key={index} className={`${msg.role === 'user' ? 'custom-message-user' : 'custom-message-assistant'}`}>
                            <span className="text" style={{ wordBreak: 'break-word' }}>{msg.content}</span>
                        </div>
                    ))}
                </div>
                <div className='d-flex flex-row'>
                    <form className="d-flex col-10 col-md-12" id="gptForm" onSubmit={handleSendMessage}>
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
                    <div className="d-flex col-2 col-md-1 align-items-end">
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
            </div>
            
            <div className="d-flex flex-column col-0 col-md-2 justify-content-left align-items-left">
                <div className="ps-2">
                </div>
            </div>
        </div>
    );
}