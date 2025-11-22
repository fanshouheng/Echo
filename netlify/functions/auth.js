// Netlify Function to proxy NextAuth routes
import { GET, POST } from '../../src/app/api/auth/[...nextauth]/route';

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
    // Create a mock request object for Next.js App Router
    const url = new URL(event.path, `https://${event.headers.host || 'localhost'}`);
    const request = new Request(url.toString(), {
      method: event.httpMethod,
      headers: new Headers(event.headers),
      body: event.body ? Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8') : null,
    });

    // Call the original NextAuth handler
    let result;

    if (event.httpMethod === 'GET') {
      result = await GET(request);
    } else if (event.httpMethod === 'POST') {
      result = await POST(request);
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
    console.error('Auth Function Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Authentication Error',
        message: error.message,
      }),
    };
  }
};