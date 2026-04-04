# Meeting-Web

A full-stack video meeting web application with real-time chat, authentication, and meeting history. Built with Node.js/Express, MongoDB, Socket.io (backend), and React (frontend).

## Features
- User authentication
- Create and join meeting rooms
- Real-time video and audio communication
- Real-time chat
- Meeting history
- Responsive UI

## Project Structure
```
Meeting-Web/
├── backend/      # Express, MongoDB, Socket.io API
├── frontend/     # React client (Create React App)
├── package.json  # Root scripts for dev, build, and install
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB (local or cloud)

### Installation
From the project root:
```sh
npm run install
```
This installs dependencies for root, backend, and frontend.

### Development
To run both backend and frontend in development mode (with hot reload):
```sh
npm start
```
- Backend: http://localhost:8000 (default)
- Frontend: http://localhost:5173 (default)

### Production Build & Serve
To build the frontend and serve it from the backend:
```sh
npm run build
npm --prefix backend start
```
- The backend will serve the static frontend from `frontend/build`.

## Environment Variables
Create a `.env` file in the `backend/` directory. See `.env.example` for required variables:
- `PORT` (default: 8000)
- `MONGODB_URI` (your MongoDB connection string)

## License

MIT License

Copyright (c) 2026 apnacollege

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
