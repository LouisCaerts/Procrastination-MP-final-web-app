const sendQuery = async (query) => {
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
      return data.message.content;
    } else {
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export default sendQuery;