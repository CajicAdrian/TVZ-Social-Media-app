import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { Routing } from './Routing';

function App(): JSX.Element {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routing />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
