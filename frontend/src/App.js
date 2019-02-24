import React, {useState, useEffect} from 'react';
import dotenv from "dotenv";
import './App.css';
import GitHubLogin from 'react-github-login';
import axios from "axios";

dotenv.config()



const App = () => {
  const [user, setUser] = useState(null);


  useEffect(() => {
    fetch('/api/me')
      .then(response => response.json())
      .then(setUser);
  }, []);


  // getting success data after github login
  const onSuccess = response => {
    console.log(response)
   axios.post('http://localhost:4000/api/github/token', {
    code:response.code
    })
    .then((response) => {
      // console token 
      console.log(response.data);
     
    })
    .catch((error) => {
      console.error(error)
    });
  
  };

  // failure data in case login fails
  const onFailure = response => console.error(response);
  

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
            <button >{user.authenticated ? 'Sign out' : 'Sign in'}</button>
          </>
        ) : null}
        <br/>
        {/*  for test github login functionality  */} 
        {/* <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT}`} alt="#">github</a> */}
        {/*  use github login package for proper view and getting data back coded in back end  */} 
        <br/>
        <GitHubLogin clientId={process.env.REACT_APP_GITHUB_CLIENT}
          onSuccess={onSuccess}
          onFailure={onFailure}
          redirectUri="http://localhost:3000/github/callback"/>
      </header>
    </div>
  );
};

export default App;
