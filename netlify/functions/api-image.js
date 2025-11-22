// Netlify Function to proxy Next.js API routes
import { handler as imageHandler } from '../src/pages/api/image';

export const handler = async (event, context) => {
  // Add required headers for CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({}),
    };
  }

  try {
    // Call the original Next.js API handler
    const result = await imageHandler(event, context);

    return {
      statusCode: result.statusCode || 200,
      headers: {
        ...headers,
        ...result.headers,
      },
      body: result.body,
      isBase64Encoded: result.isBase64Encoded || false,
    };
  } catch (error) {
    console.error('Netlify Function Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
      }),
    };
  }
};