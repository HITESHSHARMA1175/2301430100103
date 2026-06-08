import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CreateNotification from './pages/CreateNotification';
import NotificationList from './pages/NotificationList';
import NotificationDetails from './pages/NotificationDetails';
import { Log } from 'logging_middleware';
import { useEffect } from 'react';

function Navigation() {
  const location = useLocation();

  useEffect(() => {
    Log('frontend', 'info', 'notification_app_fe', `Navigated to ${location.pathname}`);
  }, [location]);

  return (
    <nav>
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Notifications</Link>
      <Link to="/create" className={location.pathname === '/create' ? 'active' : ''}>Create New</Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1 className="header">Notification Center</h1>
        <Navigation />
        <Routes>
          <Route path="/" element={<NotificationList />} />
          <Route path="/create" element={<CreateNotification />} />
          <Route path="/notifications/:id" element={<NotificationDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
