// For static export, we'll handle test accounts on the client side
export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(JSON.stringify({
    success: true,
    message: 'Test account created successfully',
    credentials: {
      email: 'test@example.com',
      password: 'test123456'
    }
  }), {
    headers: {
      'content-type': 'application/json',
    },
  });
}