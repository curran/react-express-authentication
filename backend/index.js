import express from 'express';

const app = express();

app.get('/api/me', (req, res) => {
  // TODO return data about the currently authenticated user.
  res.send('hello world');
});

app.listen(8080);
