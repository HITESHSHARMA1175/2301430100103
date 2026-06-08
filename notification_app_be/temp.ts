import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

async function run() {
  const token = process.env.ACCESS_TOKEN;
  try {
    const res = await fetch('http://4.224.186.213/evaluation-service/notifications', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      console.error(`Failed: ${res.status}`, await res.text());
      return;
    }
    const data = await res.json();
    console.log("Got", data.length, "notifications");
    console.log(JSON.stringify(data.slice(0, 5), null, 2)); // Check first 5 items
  } catch (err) {
    console.error(err);
  }
}
run();
