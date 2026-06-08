import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Log } from 'logging_middleware';

export default function CreateNotification() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3000/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, recipient })
      });

      if (!res.ok) {
        throw new Error('Failed to create notification');
      }

      await Log('frontend', 'info', 'notification_app_fe', `Created notification: ${title}`);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
      await Log('frontend', 'error', 'notification_app_fe', `Error creating notification: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px' }}>
      <h2 style={{ marginTop: 0 }}>Create Notification</h2>
      {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Meeting Reminder" />
        </div>
        <div className="form-group">
          <label>Recipient</label>
          <input required value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="user@example.com" />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Please remember the meeting at 10 AM." />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
}
