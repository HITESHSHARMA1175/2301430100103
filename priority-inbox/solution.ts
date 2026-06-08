import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envFile = fs.readFileSync(envPath, 'utf8');
            envFile.split('\n').forEach(line => {
                const parts = line.split('=');
                const key = parts[0];
                if (key && parts.length > 1) {
                    process.env[key.trim()] = parts.slice(1).join('=').trim();
                }
            });
        } else {
            console.log("Warning: .env file not found at " + envPath);
        }
    } catch (e) {
        console.log("Warning: Could not load .env file");
    }
}

interface Notification {
    ID: string;
    Type: string;        // 'Placement' | 'Result' | 'Event'
    Message: string;
    Timestamp: string;
}

async function getPriorityInbox() {
    loadEnv();
    const token = process.env.ACCESS_TOKEN;
    if (!token) {
        console.error("❌ No valid ACCESS_TOKEN found in environment. Please update your .env file with your valid token from Postman.");
        return;
    }

    try {
        const response = await fetch('http://4.224.186.213/evaluation-service/notifications', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error(`❌ Failed to fetch notifications: ${response.status}`);
            console.error(await response.text());
            return;
        }

        const rawData: any = await response.json();
        const data: Notification[] = Array.isArray(rawData) ? rawData : (rawData.notifications || rawData.data || []);

        // The assessment API doesn't provide a read/unread field in the mock, 
        // so we treat all returned items as the 'unread' inbox.
        const unreadNotifications = data;

        const weights: Record<string, number> = {
            Placement: 3,
            Result: 2,
            Event: 1
        };

        const ranked = unreadNotifications.map((n) => {
            const weight = weights[n.Type] || 0;
            const recency = new Date(n.Timestamp || 0).getTime();
            const score = (weight * 1000000000) + recency;
            
            return {
                ...n,
                score
            };
        });

        // Sort descending by score
        ranked.sort((a, b) => b.score - a.score);

        // Top 10
        const top10 = ranked.slice(0, 10);

        console.log("\nTOP 10 UNREAD NOTIFICATIONS\n");
        top10.forEach((n, i) => {
            // Output format specifically requested
            console.log(`${i + 1}. ${n.Type.padEnd(9)} | ${n.Message}`);
        });
        console.log("");

    } catch (err) {
        console.error("❌ Error running script:", err);
    }
}

getPriorityInbox();
