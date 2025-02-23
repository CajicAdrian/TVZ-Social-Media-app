import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { Routing } from './Routing';
import { NotificationsProvider } from './components/NotificationsContext';

function App(): JSX.Element {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <NotificationsProvider>
            <Routing />
          </NotificationsProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
