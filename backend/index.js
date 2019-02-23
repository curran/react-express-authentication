import express from 'express';
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.get('/api/me', (req, res) => {
  
  // TODO return data about the currently authenticated user.
  res.json({
    authenticated: true,
    id: 'foo'
  });
});

// call back url
app.get(`/user/signin/callback`, (req, res,next) => {

  // query parameter comes from github 
  const { query } = req;

  // extract code from query paramter
  const { code } = query;

  // showing log for code which we get 
  console.log(code);
  
});

app.listen(4000);
