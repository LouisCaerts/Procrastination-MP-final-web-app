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
          console.log(data.message.content);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
}

export const sendMessage = (input, setInput, setMessages, messages) => {
  if (input.trim() === '') return;

  setMessages([...messages, { user: 'You', text: input }]);
  setInput('');
};