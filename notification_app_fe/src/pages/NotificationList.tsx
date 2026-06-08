import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Log } from 'logging_middleware';

interface Notification {
  id: string;
  title: string;
  message: string;
  recipient: string;
  createdAt: string;
  status: string;
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/notifications')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data);
          Log('frontend', 'info', 'notification_app_fe', 'Loaded notification list');
        } else {
          setError(data.error || 'Failed to load');
          Log('frontend', 'error', 'notification_app_fe', 'Failed to load notifications list: Invalid array');
        }
      })
      .catch(err => {
        setError('Connection error');
        Log('frontend', 'error', 'notification_app_fe', `Fetch error: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: '#ef4444' }}>{error}</div>;

  return (
    <div>
      {notifications.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No notifications found. Create one!</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {notifications.map(n => (
            <Link to={`/notifications/${n.id}`} key={n.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card">
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{n.title}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>To: {n.recipient}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
