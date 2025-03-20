// app/api/log/route.ts
export async function POST(request: Request) {
    // const data = await request.json();
    // console.log(`[${data.level || 'INFO'}]`, data.message, data.details || '');
    return new Response(JSON.stringify({ success: true }));
  }