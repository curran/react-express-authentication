import React, {useState, useEffect} from 'react';
import dotenv from "dotenv";
import './App.css';
import { withCookies, Cookies } from 'react-cookie'
// import GitHubLogin from 'react-github-login';


dotenv.config()

const cookies = new Cookies();


const App = (props) => {
  const { cookies } = props; 
  let accessToken =  cookies.get('token') ||  null;
  
  // alert(accessToken);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(accessToken);


  useEffect(() => {



    //event listener for getting data back from popup

    window.addEventListener('message', function(event){

      // checking access code available or not

        if(!event.data.includes("setImmediate")){
      
          // storing code 
          // let code =
          //  if(event.data.includes("setImmediate")){
          //    alert();
          //  }


          // create data variable to send in api

          let data = {
            code:event.data
          };

          // api for getting jwt token from backend api

          fetch('/api/github/token', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => response.json())
            .then(function(data) {

                // checking data contains token or not
                if(data.token){
                  console.log(data.token);
                  // setting token
                  setToken(data.token)
                  cookies.set('token', data.token, { path: '/' });


                  // try to call api again after getting token
                  fetch('/api/me',{ 
                          method: "GET",
                          headers: {
                                    'Authorization': `token ${token}`
                                  }
                  })
                  .then(response => response.json())
                  .then(setUser)
                  .catch(error => {
                      setError(error);
                      console.log('error============:', error)
                    });
      
                }

            });
          
        }
    }); 


    // calling api to check token authentication wokring or not
      fetch('/api/me',{ 
                          method: "GET",
                          headers: {
                                    'Authorization': `token ${token}`
                                  }
                  })
        .then(response => response.json())
        .then(setUser)
        .catch(error => {
          setError(error);
          console.log('error============:', error)
        });


  }, []);


  // // getting success data after github login
  // const onSuccess = response => {
  // //   console.log(response)
  // //  axios.post('/api/github/token', {
  // //   code:response.code
  // //   })
  // //   .then((response) => {
  // //     // console token 
  // //     console.log(response.data);
     
  // //   })
  // //   .catch((error) => {
  // //     console.error(error)
  // //   });
  
  // };

  // failure data in case login fails
  // const onFailure = response => console.error(response);


  // function for github login
  const handleLogin = (url,id) => {

    const op = PopupCenter(url, id,600,1000);

  };

  // function for handle user logout
  const handleLogout = (props) => {
      // const { cookies } = this.props;

      let accessToken = cookies.remove('token');
      setToken(accessToken);
      setUser(null);
  };


 // function to open popup window at center

  const PopupCenter = (url, title, w, h)  => {
    // Fixes dual-screen position                         Most browsers      Firefox
    const dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop
    const newWindow = window.open(url, title, 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) newWindow.focus();
    const interval = setInterval(() => {
      
      if(newWindow.location.pathname === 'blank'){
        return
      }

      if(newWindow.location.search){
         const search = newWindow.location.search.split('=');
        //  console.log("h"+search)
         window.postMessage(search[1]);     

         clearInterval(interval);
      }

      newWindow.close();
    }, 500);

};


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
            <button onClick={() => handleLogout()}> Sign out</button>
          </>
        ) : <button onClick={() => handleLogin(`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT}`,'github-oauth-authorize')}>{'Sign in'}</button>}
        <br/>
        {/*  for test github login functionality  */} 
        <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT}`} alt="#">github</a>
        {/*  use github login package for proper view and getting data back coded in back end  */} 
        <br/>
        {/* <GitHubLogin clientId={process.env.REACT_APP_GITHUB_CLIENT}
          onSuccess={onSuccess}
          onFailure={onFailure}
          redirectUri="/github/callback"/> */}
      </header>
    </div>
  );
};

export default withCookies(App);
