import openai from 'openai';

const Openai = new openai();

export async function handler(event) {
  const requestBody = JSON.parse(event.body);
  console.log(requestBody.query);
  const query = requestBody.query;
  
  // Your existing code to interact with OpenAI API
  const completion = await Openai.chat.completions.create({
    messages: query,
    model: "gpt-3.5-turbo",
  });

  // Prepare the response object
  const response = {
    statusCode: 200, // Status code indicating success
    body: JSON.stringify(completion.choices[0]) // Convert response data to JSON string
  };

  // Return the response
  // console.log("---------------------------------------");
  // console.log(response);
  return response;
}
