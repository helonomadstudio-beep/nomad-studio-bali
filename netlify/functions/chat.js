const { Anthropic } = require('@anthropic-ai/sdk');

exports.handler = async (event, context) => {
  // Hanya izinkan metode POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message } = JSON.parse(event.body);
    
    // Mengambil API Key yang sudah di-setting di Netlify Env Variables
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Memanggil API Claude Anthropic
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022", // Sesuai versi model Claude
      max_tokens: 1024,
      messages: [{ role: "user", content: message }],
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Agar aman dari CORS
      },
      body: JSON.stringify({ reply: response.content[0].text }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

