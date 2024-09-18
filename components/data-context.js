// context/DataContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [identifyResult, setIdentifyResult] = useState(null);
  const [chatHistory, setChatHistory] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedIdentifyResult = localStorage.getItem('identifyResult');
    const storedChatHistory = localStorage.getItem('chatHistory');

    if (storedIdentifyResult) {
      setIdentifyResult(JSON.parse(storedIdentifyResult));
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
    if (chatHistory && chatHistory.value && chatHistory.value.length > 0) {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    } else {
        localStorage.removeItem('chatHistory');
    }
  }, [chatHistory]);

  return (
    <DataContext.Provider value={{ identifyResult, setIdentifyResult, chatHistory, setChatHistory }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

