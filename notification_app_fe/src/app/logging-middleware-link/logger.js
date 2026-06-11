const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyYXJjaGl0MTAxQG1wZ2kuZWR1LmluIiwiZXhwIjoxNzgxMTY0Mzc0LCJpYXQiOjE3ODExNjM0NzQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI3ZDUzMWZlYy03MmUwLTQzZjctYmI0OS1jZTg4YmEyYjcwYWIiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJoYXJzaGl0Iiwic3ViIjoiMmQ3MDg3MTMtNDFiMC00MGM4LTk3OWMtNjdhMGE5MDY4Yzc1In0sImVtYWlsIjoicmFyY2hpdDEwMUBtcGdpLmVkdS5pbiIsIm5hbWUiOiJoYXJzaGl0Iiwicm9sbE5vIjoiMjMwMD42MTUyMDAyMiIsImFjY2Vzc0NvZGUiOiJCQVZEU2giLCJjbGllbnRJRCI6IjJkNzA4NzEzLTQxYjAtNDBjOC05NzljLTY3YTBhOTA2OGM3NSIsImNsaWVudFNlY3JldCI6IkZNZW5HYWtoVUJoRGRIY2UifQ.02lGgTunWjpn4DSezvSk6s_HaxVDG7dzeASAj6OYlmE";

export async function Log(stack, level, pkg, message) {
  try {
    await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch (error) {
    console.error("Logger dispatch failure:", error.message);
  }
}