const sendQuerySummary = async (query) => {
  try {
    const extraSentence = [{ role: 'system', content: "You are a system that responds with what kind of procrastination a person was struggling with during a conversation in ten words or less.", isPrompt: true }, ...query]
    const response = await fetch('/.netlify/functions/gpttest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: extraSentence }) // Send query as JSON in request body
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

export default sendQuerySummary;