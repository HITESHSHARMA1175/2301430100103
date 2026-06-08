import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Log } from 'logging_middleware';

dotenv.config({ path: '../.env' }); // load from parent dir

const app = express();
app.use(cors());
app.use(express.json());

interface Notification {
  id: string;
  title: string;
  message: string;
  recipient: string;
  createdAt: Date;
  status: string;
}

const notifications: Notification[] = [];

// Middleware to log all incoming requests
app.use(async (req: Request, res: Response, next) => {
  await Log('backend', 'info', 'notification_app_be', `Incoming request: ${req.method} ${req.url}`);
  next();
});

app.post('/notifications', async (req: Request, res: Response) => {
  try {
    const { title, message, recipient } = req.body;
    
    if (!title || !message || !recipient) {
      await Log('backend', 'warn', 'notification_app_be', 'Validation failed: Missing fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newNotification: Notification = {
      id: Math.random().toString(36).substring(2, 15),
      title,
      message,
      recipient,
      createdAt: new Date(),
      status: 'pending'
    };

    notifications.push(newNotification);

    await Log('backend', 'info', 'notification_app_be', `Notification created with id: ${newNotification.id}`);
    return res.status(201).json(newNotification);
  } catch (error: any) {
    await Log('backend', 'error', 'notification_app_be', `Error creating notification: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/notifications', async (req: Request, res: Response) => {
  await Log('backend', 'info', 'notification_app_be', 'Fetched all notifications');
  return res.status(200).json(notifications);
});

app.get('/notifications/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const notification = notifications.find(n => n.id === id);

  if (!notification) {
    await Log('backend', 'warn', 'notification_app_be', `Notification not found: ${id}`);
    return res.status(404).json({ error: 'Notification not found' });
  }

  await Log('backend', 'info', 'notification_app_be', `Fetched notification: ${id}`);
  return res.status(200).json(notification);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
