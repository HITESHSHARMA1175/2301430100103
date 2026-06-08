import axios from 'axios';

// Get token from Vite environment wrapper
const TOKEN = import.meta.env.VITE_ACCESS_TOKEN || '';

const api = axios.create({
  baseURL: 'http://4.224.186.213/evaluation-service',
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface Notification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
}

export const getNotifications = async (
  page?: number,
  limit?: number,
  notification_type?: string
) => {
  const params: Record<string, any> = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (notification_type) params.notification_type = notification_type;

  const res = await api.get('/notifications', { params });
  
  // Handle if API returns { notifications: [...] } or just [...]
  if (Array.isArray(res.data)) {
      return res.data as Notification[];
  }
  return (res.data.notifications || res.data.data || []) as Notification[];
};
