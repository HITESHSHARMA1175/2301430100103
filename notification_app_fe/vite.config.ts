import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../', '');
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_ACCESS_TOKEN': JSON.stringify(env.ACCESS_TOKEN)
    }
  }
})
