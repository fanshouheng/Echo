// Netlify Function to proxy NextAuth routes
import { handler as authHandler } from '../src/pages/api/auth/[...nextauth]';

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    // Call the original NextAuth handler
    const result = await authHandler(event, context);

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