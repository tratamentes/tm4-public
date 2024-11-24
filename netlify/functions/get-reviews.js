// netlify/functions/get-reviews.js
const { google } = require('googleapis');

exports.handler = async function(event, context) {
  try {
    // Configurar autenticação OAuth2
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://tratamentes.pt/oauth2callback' // URL de redirecionamento atualizada
    );

    // Configurar credenciais
    oauth2Client.setCredentials({
      access_token: event.headers.authorization?.split(' ')[1]
    });

    // Criar cliente da API Business Profile
    const businessProfile = google.mybusiness({
      version: 'v4',
      auth: oauth2Client
    });

    // Buscar reviews
    const response = await businessProfile.accounts.locations.reviews.list({
      parent: `accounts/${process.env.GOOGLE_BUSINESS_ACCOUNT}/locations/01707353252485998728`,
      pageSize: 100 // Máximo de reviews por página
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://tratamentes.pt',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://tratamentes.pt'
      },
      body: JSON.stringify({ 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};