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
        }
    } catch (e) {}
}

async function run() {
    loadEnv();
    const token = process.env.ACCESS_TOKEN;
    try {
        const response = await fetch('http://4.224.186.213/evaluation-service/notifications?page=1&limit=20', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log(JSON.stringify(data).substring(0, 500));
    } catch(e) {
        console.error(e);
    }
}
run();
