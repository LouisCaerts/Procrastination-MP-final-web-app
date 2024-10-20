// context/DataContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [identifyResult, setIdentifyResult] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedIdentifyResult = localStorage.getItem('identifyResult');
    const storedIdentifyId = localStorage.getItem('chatId');
    const storedChatHistory = localStorage.getItem('chatHistory');

    if (storedIdentifyResult) {
      setIdentifyResult(JSON.parse(storedIdentifyResult));
    }
    if (storedIdentifyId) {
      setChatId(JSON.parse(storedIdentifyId));
    }
    if (storedChatHistory) {
      setChatHistory(JSON.parse(storedChatHistory));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (identifyResult && identifyResult.value != "none") {
        localStorage.setItem('identifyResult', JSON.stringify(identifyResult));
    } else {
        localStorage.removeItem('identifyResult');
    }
  }, [identifyResult]);

  useEffect(() => {
    if (chatId && chatId.value > -1) {
        localStorage.setItem('chatId', JSON.stringify(chatId));
    } else {
        localStorage.removeItem('chatId');
    }
  }, [chatId]);

  useEffect(() => {
    if (chatHistory && chatHistory.value && chatHistory.value.length > 0) {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    } else {
        localStorage.removeItem('chatHistory');
    }
  }, [chatHistory]);

  return (
    <DataContext.Provider value={{ identifyResult, setIdentifyResult, chatId, setChatId, chatHistory, setChatHistory }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

