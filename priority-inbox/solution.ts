import * as fs from 'fs';
import * as path from 'path';

// Load environment variables manually to avoid external dependencies like dotenv
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env');
        if (fs.existsSync(envPath)) {
            const envFile = fs.readFileSync(envPath, 'utf8');
            envFile.split('\n').forEach(line => {
                const [key, ...values] = line.split('=');
                if (key && values.length > 0) {
                    process.env[key.trim()] = values.join('=').trim();
                }
            });
        }
    } catch (e) {
        console.log("Warning: Could not load .env file");
    }
}

interface Notification {
    id: string;
    studentID?: number;
    student_id?: number;
    type: string;        // 'Placement' | 'Result' | 'Event'
    message: string;
    isRead?: boolean;
    is_read?: boolean;
    recency_score?: number;
    recencyScore?: number;
    createdAt?: string;
    created_at?: string;
}

async function getPriorityInbox() {
    loadEnv();
    const token = process.env.ACCESS_TOKEN;
    if (!token || token.startsWith("eyJ...") || token.trim() === "") {
        console.error("❌ No valid ACCESS_TOKEN found in environment. Please update your .env file with your valid token from Postman.");
        return;
    }

    try {
        console.log("Fetching notifications from Evaluation Service...");
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

        const data: Notification[] = await response.json();
        console.log(`Successfully fetched ${data.length} total notifications.`);

        // 1. Filter unread
        const unread = data.filter(n => n.isRead === false || n.is_read === false);
        console.log(`Found ${unread.length} unread notifications.`);

        // 2. Score
        const scored = unread.map(n => {
            let weight = 0;
            const t = (n.type || '').toLowerCase();
            if (t === 'placement') weight = 3;
            else if (t === 'result') weight = 2;
            else if (t === 'event') weight = 1;

            let recency = n.recency_score ?? n.recencyScore ?? 0;
            const priority_score = (weight * 100000) + recency;

            return { ...n, priority_score };
        });

        // 3. Sort (Heap / Priority Queue logic)
        scored.sort((a, b) => b.priority_score - a.priority_score);

        // 4. Top 10
        const top10 = scored.slice(0, 10);

        console.log("\n=============================================");
        console.log("          TOP 10 UNREAD NOTIFICATIONS          ");
        console.log("=============================================\n");
        
        top10.forEach((n, i) => {
            console.log(`${i + 1}. [${n.type}] Priority Score: ${n.priority_score}`);
            console.log(`   Message: ${n.message}`);
            console.log(`   ID: ${n.id}\n`);
        });

    } catch (err) {
        console.error("❌ Error running script:", err);
    }
}

getPriorityInbox();
