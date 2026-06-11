import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const page = searchParams.get('page') || '1';
    const type = searchParams.get('notification_type');

    let targetUrl = `http://4.224.186.213/evaluation-service/notifications?limit=${limit}&page=${page}`;
    if (type && type !== 'All') {
      targetUrl += `&notification_type=${type}`;
    }

    // Activated fresh access token string
    const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyYXJjaGl0MTAxQG1wZ2kuZWR1LmluIiwiZXhwIjoxNzgxMTcwNTIxLCJpYXQiOjE3ODExNjk2MjEsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJlNzY4Njg0ZC05NDAxLTQ1YTMtODJkMy0yY2M3OGNjMzkwOTAiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJoYXJzaGl0Iiwic3ViIjoiMmQ3MDg3MTMtNDFiMC00MGM4LTk3OWMtNjdhMGE5MDY4Yzc1In0sImVtYWlsIjoicmFyY2hpdDEwMUBtcGdpLmVkdS5pbiIsIm5hbWUiOiJoYXJzaGl0Iiwicm9sbE5vIjoiMjMwMDQ2MTUyMDAyMiIsImFjY2Vzc0NvZGUiOiJCQVZEU2giLCJjbGllbnRJRCI6IjJkNzA4NzEzLTQxYjAtNDBjOC05NzljLTY3YTBhOTA2OGM3NSIsImNsaWVudFNlY3JldCI6IkZNZW5HYWtoVUJoRGRIY2UifQ.oSiDFuaYSPtk5bL9ish_JKxxCygKuerPcH7DQ3hg7aQ";

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${AUTH_TOKEN}`,
        "Accept": "application/json"
      },
      cache: 'no-store'
    });

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message, notifications: [] }, { status: 500 });
  }
}