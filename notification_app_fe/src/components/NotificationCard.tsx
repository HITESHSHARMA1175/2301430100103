import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { CheckCircleOutline, FiberNew } from '@mui/icons-material';
import { Notification } from '../services/api';

interface Props {
  notification: Notification;
  rank?: number;
}

export default function NotificationCard({ notification, rank }: Props) {
  const [viewed, setViewed] = useState(false);

  useEffect(() => {
    const isViewed = localStorage.getItem(notification.ID);
    if (isViewed === 'viewed') {
      setViewed(true);
    }
  }, [notification.ID]);

  const handleClick = () => {
    localStorage.setItem(notification.ID, 'viewed');
    setViewed(true);
  };

  const getTypeColor = (type: string) => {
    if (type === 'Placement') return 'primary';
    if (type === 'Result') return 'secondary';
    if (type === 'Event') return 'success';
    return 'default';
  };

  return (
    <Card 
      onClick={handleClick}
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        },
        bgcolor: viewed ? 'action.hover' : 'background.paper',
        position: 'relative'
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            {rank && <Typography variant="h6" color="text.secondary">#{rank}</Typography>}
            <Chip 
              label={notification.Type} 
              color={getTypeColor(notification.Type) as any} 
              size="small" 
            />
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            {viewed ? (
              <Chip icon={<CheckCircleOutline />} label="Viewed Notification" size="small" variant="outlined" color="default" />
            ) : (
              <Chip icon={<FiberNew />} label="New Notification" size="small" color="info" />
            )}
          </Box>
        </Box>
        <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
          {notification.Message}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(notification.Timestamp).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
}
