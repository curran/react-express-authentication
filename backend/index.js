import express from 'express';
import dotenv from "dotenv";
// import passport from "passport";
import axios from "axios";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

axios.defaults.headers.post['Accept'] = 'application/json';

dotenv.config();



const app = express();

app.use(bodyParser.json());

app.use(cors());


app.get('/api/me', (req, res) => {
  
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
app.post('/api/github/token',(req,res,next) => {

    // getting code from callback
    var code = req.body.code;

    // API for getting token from github
    return axios.post('https://github.com/login/oauth/access_token', {
        client_id:	process.env.GITHUB_CLIENT,
        client_secret:	process.env.GITHUB_SECRET,
        code: code
    })
    .then((response) => {
      // store token in varioable
      let token = response.data.access_token;

      // set tone in header for fetching user 
      axios.defaults.headers.common['Authorization'] = 'token ' + token;

      // api for getting profile data
      return axios.get('https://api.github.com/user').then(resp => {
        // storung user prifle for creating access token
        let user = resp.data;

        // genrating jwt token with expired in 24 hour and sending to front
        jwt.sign(user, "curran", { expiresIn: 60 * 60 * 24 }, (err, token) => {
          res.json({
            token
          });
        });

      }).catch(err => {
        res.send(err);
      });      
    })
    .catch((error) => {
      res.send(error)
    });

});

// verifying token
function verifyToken(req, res, next) {
  // getting auth header
  const bearerHeader = req.headers["authorization"];

  //check if tokeni there or not
  if (typeof bearerHeader !== "undefined") {
    //split at the space
    const bearer = bearerHeader.split(" ");
    // egt token from splited array
    const bearerToken = bearer[1];
    // set token
    req.token = bearerToken;
    // proceed next
    next();
  } else {
    res.sendStatus(403);
  }
}


app.listen(4000);
