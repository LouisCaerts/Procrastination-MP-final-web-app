export const addChatEventListeners = () => {
  document.getElementById('gptForm').addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevent default form submission
    
      const formData = new FormData(this); // Get form data
      const query = formData.get('gptInput'); // Get query from form
    
      try {
        const response = await fetch('/.netlify/functions/gpttest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query }) // Send query as JSON in request body
        });
    
        if (response.ok) {
          const data = await response.json();
    
          let gptResponse = document.getElementById('gptResponse');
          sendMessage(data.message.content, lastSetInput, lastSetMessages, lastMessages, true);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
}

let lastInput = 0;
let lastSetInput = 0;
let lastMessages = 0;
let lastSetMessages = 0;

export const sendMessage = (input, setInput, setMessages, messages, gpt=false) => {
  if (!gpt && input.trim() === '') {
    return;
  }

  if (!gpt) {
    lastInput = input;
    lastSetInput = setInput;
    lastMessages = messages;
    lastSetMessages = setMessages;

    setMessages([...messages, { user: 'You', text: input }]);
    setInput('');
  } else {
    setMessages([...messages, { user: 'Bot', text: input }]);
  }
};