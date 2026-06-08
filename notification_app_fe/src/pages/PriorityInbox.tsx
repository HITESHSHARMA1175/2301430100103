import { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { getNotifications, Notification } from '../services/api';
import NotificationCard from '../components/NotificationCard';

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAndRank();
  }, []);

  const fetchAndRank = async () => {
    setLoading(true);
    try {
      // Fetch all notifications to rank them
      const data = await getNotifications();
      
      const weights: Record<string, number> = {
          Placement: 3,
          Result: 2,
          Event: 1
      };

      const ranked = data.map(n => {
          const weight = weights[n.Type] || 0;
          const recency = new Date(n.Timestamp || 0).getTime();
          const score = (weight * 1000000000) + recency;
          return { ...n, score };
      });

      ranked.sort((a, b) => b.score - a.score);
      const top10 = ranked.slice(0, 10);
      
      setNotifications(top10);
    } catch (err) {
      console.error("Failed to fetch priority inbox", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ pb: 4 }}>
      <Box sx={{ borderBottom: '1px solid #ccc', pb: 2, mb: 3 }}>
        <Typography variant="h4" component="h1">
          Priority Inbox
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : notifications.length === 0 ? (
        <Typography color="text.secondary">No priority notifications found.</Typography>
      ) : (
        notifications.map((notif, idx) => (
          <NotificationCard key={notif.ID} notification={notif} rank={idx + 1} />
        ))
      )}
    </Container>
  );
}
