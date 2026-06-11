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

    // Pulls the token securely from your machine's environment variables
const AUTH_TOKEN = process.env.CAMPUS_AUTH_TOKEN;
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