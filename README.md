# react-express-authentication

(work in progress) An example app with authentication.

The frontend is a React app bootstrapped from create-react-app.

The backend is a minimal ExpressJS API server.

To start the backend (port 4000):

```
cd backend
npm start
```

To start the frontend dev server (port 3000), in a new terminal:

```
cd frontend
npm start
```

The frontend dev server is configured to proxy API requests to the API server. So for example, accessing `localhost:3000/api/me` on the dev server will proxy through to the API server at `localhost:4000/api/me`.
