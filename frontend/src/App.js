import React, {useState, useEffect} from 'react';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/me')
      .then(response => response.json())
      .then(setUser);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {user ? (
          <>
            <p>
              {user.authenticated
                ? 'Authenticated id: ' + user.id
                : 'Not authenticated.'}
            </p>
            <button>{user.authenticated ? 'Sign out' : 'Sign in'}</button>
          </>
        ) : null}
      </header>
    </div>
  );
};

export default App;
