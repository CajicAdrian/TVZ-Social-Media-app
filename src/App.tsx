import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routing } from './Routing';

function App(): JSX.Element {
  return (
    <div className="App">
      <Router>
        <Routing />
      </Router>
    </div>
  );
}

export default App;
