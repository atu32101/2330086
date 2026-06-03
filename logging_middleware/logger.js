const axios = require('axios');

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhdHU4MjE5N0BnbWFpbC5jb20iLCJleHAiOjE3ODA0NzcxOTAsImlhdCI6MTc4MDQ3NjI5MCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjI0ZWNiZjA2LWIyZjgtNDRjMy05ZGFkLTJiNmI0OTVhY2ZiMSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImF0dWwgdmVybWEiLCJzdWIiOiJmYmNjZTcxNi0yNjRiLTRmYTMtYTcwNi05MTJkOGZkYTQ5YTMifSwiZW1haWwiOiJhdHU4MjE5N0BnbWFpbC5jb20iLCJuYW1lIjoiYXR1bCB2ZXJtYSIsInJvbGxObyI6IjIzMzAwODYiLCJhY2Nlc3NDb2RlIjoibnd3c0t4IiwiY2xpZW50SUQiOiJmYmNjZTcxNi0yNjRiLTRmYTMtYTcwNi05MTJkOGZkYTQ5YTMiLCJjbGllbnRTZWNyZXQiOiJYUnhoc0FNcFZwUUJCc2FSIn0.3xNXd-AMOIzPwBtaF2WweCrN67kpaHUOF3Uhnrgk8i4";

async function Log(stack, level, package_name, message) {
    try {
        const response = await axios.post(
            'http://4.224.186.213/evaluation-service/logs',
            {
                stack: stack,
                level: level,
                package: package_name,
                message: message
            },
            {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Log created:', response.data);
    } catch (error) {
        console.error('Logging failed:', error.message);
    }
}

module.exports = { Log };
