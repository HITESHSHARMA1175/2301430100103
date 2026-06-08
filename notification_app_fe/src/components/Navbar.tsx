import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Notification System
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/notifications"
            sx={{ fontWeight: location.pathname === '/notifications' ? 'bold' : 'normal', borderBottom: location.pathname === '/notifications' ? '2px solid white' : 'none', borderRadius: 0 }}
          >
            All Notifications
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/priority-inbox"
            sx={{ fontWeight: location.pathname === '/priority-inbox' ? 'bold' : 'normal', borderBottom: location.pathname === '/priority-inbox' ? '2px solid white' : 'none', borderRadius: 0 }}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
