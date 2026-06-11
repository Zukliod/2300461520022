import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Pulls the token securely from your machine's environment variables
    const AUTH_TOKEN = process.env.CAMPUS_AUTH_TOKEN;
    const serverPayload = {
      stack: body.stack,
      level: body.level,
      package: body.package,
      message: body.message
    };

    const response = await fetch("http://4.224.186.213/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify(serverPayload)
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}