import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Log } from 'logging_middleware';

interface Notification {
  id: string;
  title: string;
  message: string;
  recipient: string;
  createdAt: string;
  status: string;
}

export default function NotificationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/notifications/${id}`)
      .then(async res => {
        if (!res.ok) {
          throw new Error('Notification not found');
        }
        return res.json();
      })
      .then(data => {
        setNotification(data);
        Log('frontend', 'info', 'notification_app_fe', `Viewed details for notification: ${id}`);
      })
      .catch(err => {
        setError(err.message);
        Log('frontend', 'error', 'notification_app_fe', `Failed to load details for ${id}: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return (
    <div>
      <p style={{ color: '#ef4444' }}>{error}</p>
      <button onClick={() => navigate('/')}>Back</button>
    </div>
  );
  if (!notification) return null;

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{notification.title}</h2>
      <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
        <p><strong>To:</strong> {notification.recipient}</p>
        <p><strong>Status:</strong> {notification.status}</p>
        <p><strong>Date:</strong> {new Date(notification.createdAt).toLocaleString()}</p>
      </div>
      <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{notification.message}</p>
      <button onClick={() => navigate('/')} style={{ marginTop: '2rem' }}>Back to List</button>
    </div>
  );
}
