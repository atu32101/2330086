const axios = require('axios');

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhdHU4MjE5N0BnbWFpbC5jb20iLCJleHAiOjE3ODA0ODEwNDQsImlhdCI6MTc4MDQ4MDE0NCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjkwYWRhZTRlLTJhNDEtNDEwYS05MjRiLWQ0MzkwYjVjMjYyYyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImF0dWwgdmVybWEiLCJzdWIiOiJmYmNjZTcxNi0yNjRiLTRmYTMtYTcwNi05MTJkOGZkYTQ5YTMifSwiZW1haWwiOiJhdHU4MjE5N0BnbWFpbC5jb20iLCJuYW1lIjoiYXR1bCB2ZXJtYSIsInJvbGxObyI6IjIzMzAwODYiLCJhY2Nlc3NDb2RlIjoibnd3c0t4IiwiY2xpZW50SUQiOiJmYmNjZTcxNi0yNjRiLTRmYTMtYTcwNi05MTJkOGZkYTQ5YTMiLCJjbGllbnRTZWNyZXQiOiJYUnhoc0FNcFZwUUJCc2FSIn0.JrzbyTE-mbhjG_EFt6MERYPIVpSgplFr4pEyVM-85sk";

const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
};

function knapsack(tasks, maxHours) {
    const n = tasks.length;
    const dp = Array(maxHours + 1).fill(0);
    const selected = Array(n).fill(false);
    for (let i = 0; i < n; i++) {
        const { Duration, Impact } = tasks[i];
        for (let w = maxHours; w >= Duration; w--) {
            if (dp[w - Duration] + Impact > dp[w]) {
                dp[w] = dp[w - Duration] + Impact;
            }
        }
    }
    let w = maxHours;
    for (let i = n - 1; i >= 0; i--) {
        const { Duration, Impact } = tasks[i];
        if (w >= Duration && dp[w] === dp[w - Duration] + Impact) {
            selected[i] = true;
            w -= Duration;
        }
    }
    return tasks.filter((_, i) => selected[i]);
}

async function main() {
    try {
        console.log("Fetching depots...");
        const depotsRes = await axios.get('http://4.224.186.213/evaluation-service/depots', { headers });
        const depots = depotsRes.data.depots;
        console.log(`Found ${depots.length} depots`);

        console.log("Fetching vehicles...");
        const vehiclesRes = await axios.get('http://4.224.186.213/evaluation-service/vehicles', { headers });
        const tasks = vehiclesRes.data.vehicles;
        console.log(`Found ${tasks.length} tasks`);

        for (const depot of depots) {
            const { ID, MechanicHours } = depot;
            console.log(`\nDepot ${ID} - Available Hours: ${MechanicHours}`);
            const bestTasks = knapsack(tasks, MechanicHours);
            const totalImpact = bestTasks.reduce((sum, t) => sum + t.Impact, 0);
            const totalHours = bestTasks.reduce((sum, t) => sum + t.Duration, 0);
            console.log(`Total Hours Used: ${totalHours}`);
            console.log(`Total Impact Score: ${totalImpact}`);
            console.log("Selected Tasks:", bestTasks.map(t => t.TaskID));
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();