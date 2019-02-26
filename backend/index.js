import express from 'express';
import dotenv from "dotenv";
// import passport from "passport";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";


// axios.defaults.headers.post['Accept'] = 'application/json';

dotenv.config();



const app = express();

app.use(bodyParser.json());



app.get('/api/me', verifyToken,(req, res) => {
  
  // TODO return data about the currently authenticated user.
  res.json({
    authenticated: true,
    id: 'foo'
  });
});

// // call back url
// app.get(`/user/signin/callback`, (req, res,next) => {

//   // query parameter comes from github 
//   const { query } = req;

//   // extract code from query paramter
//   const { code } = query;

//   // showing log for code which we get 
//   console.log(code);
  
// });

// api to create github token 
app.post('/api/github/token',cors(),(req,res,next) => {

    // getting code from callback
      const code = req.body.code;

      // setting data for sending to github
      const data = {
        client_id:	process.env.GITHUB_CLIENT,
        client_secret:	process.env.GITHUB_SECRET,
        code: code
      };

      // api calling for fetching github user profile  
    return fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          mode: "cors",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((data) => {
              // store token in variaable
              let token = data.access_token;

            // set token in header for fetching user 
            // api for getting profile data
              return fetch('https://api.github.com/user',{
                method: 'GET',
                mode: "cors",
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `token ${token}`
                }
              })
              .then((response) => response.json())
              .then((data) => {
                  // storing user profile for creating access token
                  let user = data;

                  // generating jwt token with expired in 24 hour and sending to front
                  jwt.sign(user, process.env.SECERT, { expiresIn: 60 * 60 * 24 }, (err, token) => {
                    res.json({
                      token
                    });
                  });

            }).catch(err => {
              // sending error if it occurs
              res.send(err);
            });
      })
      .catch((error) => {
        // sending error if it occurs
        res.send(error)
      });


});

// verifying token
function verifyToken(req, res, next) {
  // getting auth header
  const bearerHeader = req.headers["authorization"];

  //check if token is there or not
  if (typeof bearerHeader !== "undefined" && bearerHeader !== "null") {
    //split at the space
    const bearer = bearerHeader.split(" ");
    // get token from splited array
    const bearerToken = bearer[1];
    // set token
    req.token = bearerToken;
    // proceed next
    next();
  } else {
    res.sendStatus(401,"User not authenticated!");
  }
}




app.listen(4000);
