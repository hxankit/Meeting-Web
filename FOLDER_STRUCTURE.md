# Project Folder Structure

This document outlines the proper folder structure for both backend and frontend.

## Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   └── index.ts              # Configuration (port, CORS, etc.)
│   ├── controllers/
│   │   └── roomController.ts     # REST API route handlers
│   ├── routes/
│   │   └── roomRoutes.ts         # Express route definitions
│   ├── services/
│   │   ├── roomService.ts        # Room management business logic
│   │   └── socketService.ts      # Socket.io event handlers
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   └── index.ts                  # Main server entry point
├── package.json
├── tsconfig.json
└── .gitignore
```

### Backend Organization

- **config/**: Configuration files (environment variables, settings)
- **controllers/**: Request handlers for REST endpoints
- **routes/**: Route definitions that map URLs to controllers
- **services/**: Business logic and data management
- **types/**: TypeScript type definitions and interfaces
- **index.ts**: Application entry point that sets up Express and Socket.io

## Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── MeetingControls.tsx   # Meeting control buttons
│   │   └── VideoPlayer.tsx       # Video stream display component
│   ├── config/
│   │   └── index.ts              # Frontend configuration
│   ├── hooks/
│   │   ├── useSocket.ts          # Socket.io connection hook
│   │   └── useWebRTC.ts          # WebRTC peer connection hook
│   ├── pages/
│   │   ├── HomePage.tsx          # Home page (create/join room)
│   │   └── MeetingRoom.tsx       # Meeting room page
│   ├── services/
│   │   ├── api.ts                # REST API service functions
│   │   └── socketService.ts      # Socket.io client service
│   ├── styles/
│   │   └── App.css               # Main stylesheet
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── utils/
│   │   └── webrtc.ts             # WebRTC utility functions
│   ├── App.tsx                   # Main app component with routing
│   ├── main.tsx                  # React entry point
│   └── vite-env.d.ts             # Vite environment types
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .gitignore
```

### Frontend Organization

- **components/**: Reusable UI components
- **config/**: Configuration files
- **hooks/**: Custom React hooks
- **pages/**: Page-level components (routes)
- **services/**: API and external service integrations
- **styles/**: CSS stylesheets
- **types/**: TypeScript type definitions
- **utils/**: Utility functions and helpers

## Key Principles

1. **Separation of Concerns**: Each folder has a specific purpose
2. **Modularity**: Related functionality is grouped together
3. **Scalability**: Easy to add new features without cluttering
4. **Type Safety**: All TypeScript types are centralized in `types/` folders
5. **Service Layer**: Business logic separated from UI components

## Import Paths

### Backend
```typescript
// From services
import { RoomService } from "./services/roomService";

// From types
import { Participant, Room } from "./types";

// From config
import { config } from "./config";
```

### Frontend
```typescript
// From pages
import { HomePage } from "./pages/HomePage";

// From components
import { VideoPlayer } from "./components/VideoPlayer";

// From services
import { createRoom } from "./services/api";

// From hooks
import { useSocket } from "./hooks/useSocket";

// From types
import { Participant } from "./types";

// From config
import { config } from "./config";
```

