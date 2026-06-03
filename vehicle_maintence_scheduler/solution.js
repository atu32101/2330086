const axios = require('axios');

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhdHU4MjE5N0BnbWFpbC5jb20iLCJleHAiOjE3ODA0ODEzOTcsImlhdCI6MTc4MDQ4MDQ5NywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImEyZTNkY2ViLTI5ZTctNDE3Yi1hYzMyLWZiNjBlOGY3ZDAwMSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImF0dWwgdmVybWEiLCJzdWIiOiJmYmNjZTcxNi0yNjRiLTRmYTMtYTcwNi05MTJkOGZkYTQ5YTMifSwiZW1haWwiOiJhdHU4MjE5N0BnbWFpbC5jb20iLCJuYW1lIjoiYXR1bCB2ZXJtYSIsInJvbGxObyI6IjIzMzAwODYiLCJhY2Nlc3NDb2RlIjoibnd3c0t4IiwiY2xpZW50SUQiOiJmYmNjZTcxNi0yNjRiLTRmYTMtYTcwNi05MTJkOGZkYTQ5YTMiLCJjbGllbnRTZWNyZXQiOiJYUnhoc0FNcFZwUUJCc2FSIn0.NqKv1rCb4-771wvOUbOa7JM3sBO-GTUGVwermoTTOp8";

const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
};

function knapsack(tasks, maxHours) {
    const n = tasks.length;
    // dp[i][w] = max impact using first i tasks with w hours
    const dp = [];
    for (let i = 0; i <= n; i++) {
        dp[i] = new Array(maxHours + 1).fill(0);
    }

    for (let i = 1; i <= n; i++) {
        const dur = tasks[i-1].Duration;
        const imp = tasks[i-1].Impact;
        for (let w = 0; w <= maxHours; w++) {
            dp[i][w] = dp[i-1][w];
            if (w >= dur) {
                dp[i][w] = Math.max(dp[i][w], dp[i-1][w-dur] + imp);
            }
        }
    }

    // Traceback
    const selected = [];
    let w = maxHours;
    for (let i = n; i >= 1; i--) {
        if (dp[i][w] !== dp[i-1][w]) {
            selected.push(tasks[i-1]);
            w -= tasks[i-1].Duration;
        }
    }

    return { selected, totalImpact: dp[n][maxHours] };
}

async function main() {
    try {
        console.log("Fetching depots...");
        const depotsRes = await axios.get(
            'http://4.224.186.213/evaluation-service/depots',
            { headers }
        );
        const depots = depotsRes.data.depots;
        console.log(`Found ${depots.length} depots\n`);

        console.log("Fetching vehicles...");
        const vehiclesRes = await axios.get(
            'http://4.224.186.213/evaluation-service/vehicles',
            { headers }
        );
        const tasks = vehiclesRes.data.vehicles;
        console.log(`Found ${tasks.length} tasks\n`);

        for (const depot of depots) {
            const { ID, MechanicHours } = depot;
            const { selected, totalImpact } = knapsack(tasks, MechanicHours);
            const totalHours = selected.reduce((s, t) => s + t.Duration, 0);

            console.log(`Depot ${ID}:`);
            console.log(`  Mechanic Hours Available: ${MechanicHours}`);
            console.log(`  Tasks Selected: ${selected.length}`);
            console.log(`  Total Hours Used: ${totalHours}`);
            console.log(`  Total Impact Score: ${totalImpact}`);
            console.log('');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
