import React, {useState, useEffect} from 'react';
import dotenv from "dotenv";
import './App.css';
dotenv.config()



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
        <br/>
        {/*  for test github login functionality  */} 
        <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT}`} alt="#">github</a>
      </header>
    </div>
  );
};

export default App;
