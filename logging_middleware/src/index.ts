declare const process: any;

export async function Log(
  stack: string,
  level: string,
  packageName: string,
  message: string
): Promise<void> {
  let token = '';
  
  // Try to get token from process.env (Node.js or injected by Vite/Webpack)
  try {
    if (typeof process !== 'undefined' && process.env) {
      token = process.env.ACCESS_TOKEN || process.env.VITE_ACCESS_TOKEN || '';
    }
  } catch (e) {
    // Ignore error if process is undefined
  }

  // Try to get token from import.meta.env (Vite natively)
  if (!token) {
    try {
      // @ts-ignore
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        token = import.meta.env.VITE_ACCESS_TOKEN || '';
      }
    } catch (e) {}
  }

  try {
    const response = await fetch('http://4.224.186.213/evaluation-service/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        stack,
        level,
        packageName,
        message
      })
    });

    if (!response.ok) {
      console.error(`[logging_middleware] Failed to send log. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`[logging_middleware] Error sending log:`, error);
  }
}
