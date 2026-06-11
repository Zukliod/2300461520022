import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Activated fresh access token string
    const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyYXJjaGl0MTAxQG1wZ2kuZWR1LmluIiwiZXhwIjoxNzgxMTcwNTIxLCJpYXQiOjE3ODExNjk2MjEsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJlNzY4Njg0ZC05NDAxLTQ1YTMtODJkMy0yY2M3OGNjMzkwOTAiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJoYXJzaGl0Iiwic3ViIjoiMmQ3MDg3MTMtNDFiMC00MGM4LTk3OWMtNjdhMGE5MDY4Yzc1In0sImVtYWlsIjoicmFyY2hpdDEwMUBtcGdpLmVkdS5pbiIsIm5hbWUiOiJoYXJzaGl0Iiwicm9sbE5vIjoiMjMwMDQ2MTUyMDAyMiIsImFjY2Vzc0NvZGUiOiJCQVZEU2giLCJjbGllbnRJRCI6IjJkNzA4NzEzLTQxYjAtNDBjOC05NzljLTY3YTBhOTA2OGM3NSIsImNsaWVudFNlY3JldCI6IkZNZW5HYWtoVUJoRGRIY2UifQ.oSiDFuaYSPtk5bL9ish_JKxxCygKuerPcH7DQ3hg7aQ";

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