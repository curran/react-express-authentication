import express from 'express';

const app = express();

app.get('/api/me', (req, res) => {
  // TODO return data about the currently authenticated user.
  res.json({
    authenticated: true,
    id: 'foo'
  });
});

app.listen(4000);
