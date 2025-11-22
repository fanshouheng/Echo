// Netlify Function to proxy Next.js API routes
import { GET, POST } from '../../src/app/api/generate-image/route';

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
    let result;

    if (event.httpMethod === 'GET') {
      result = await GET(event);
    } else if (event.httpMethod === 'POST') {
      result = await POST(event);
    } else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    return {
      statusCode: result.status || 200,
      headers: {
        ...headers,
        ...Object.fromEntries(result.headers || []),
      },
      body: result.body ? await result.body.text() : '',
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