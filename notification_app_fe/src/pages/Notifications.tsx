import { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box, Pagination } from '@mui/material';
import { getNotifications } from '../services/api';
import type { Notification } from '../services/api';
import NotificationCard from '../components/NotificationCard';
import FilterBar from '../components/FilterBar';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchData();
  }, [filterType, page]);

  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      let data;
      if (filterType) {
        data = await getNotifications(undefined, undefined, filterType);
      } else {
        data = await getNotifications(page, limit, undefined);
      }
      setNotifications(data || []);
    } catch (err: any) {
      console.error("Failed to fetch notifications", err);
      setErrorMsg(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ pb: 4 }}>
      <Box sx={{ borderBottom: '1px solid #ccc', pb: 2, mb: 3 }}>
        <Typography variant="h4" component="h1">
          Notifications
        </Typography>
      </Box>

      <FilterBar 
        selectedType={filterType} 
        onChange={(type) => { setFilterType(type); setPage(1); }} 
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : errorMsg ? (
        <Typography color="error">{errorMsg}</Typography>
      ) : notifications.length === 0 ? (
        <Typography color="text.secondary">No notifications found.</Typography>
      ) : (
        <>
          {notifications.map((notif) => (
            <NotificationCard key={notif.ID} notification={notif} />
          ))}
          
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination 
              count={5} // Using 5 as placeholder since API might not provide total count
              page={page} 
              onChange={(_, value) => setPage(value)} 
              color="primary" 
            />
          </Box>
        </>
      )}
    </Container>
  );
}
