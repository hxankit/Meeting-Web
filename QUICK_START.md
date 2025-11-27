# Quick Start Guide

## Quick Setup (5 minutes)

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 3. Start Backend Server
```bash
cd ../backend
npm run dev
```
Backend will run on `http://localhost:3001`

### 4. Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### 5. Open in Browser
Open `http://localhost:5173` in your browser (preferably Chrome or Firefox)

## Testing the Application

1. **Create a Room:**
   - Click "Create Room"
   - Allow camera/microphone permissions when prompted
   - You'll see your video stream

2. **Join from Another Browser/Device:**
   - Open the same URL in another browser tab or device
   - Click "Join Existing Room"
   - Enter the room ID from step 1
   - Allow permissions
   - You should see both video streams

3. **Test Features:**
   - Click microphone icon to mute/unmute
   - Click camera icon to turn video on/off
   - Click screen share icon to share your screen
   - Click leave to exit

## Troubleshooting

**No video/audio:**
- Check browser console for errors
- Ensure permissions are granted
- Try refreshing the page

**Can't see other participants:**
- Verify both users are in the same room
- Check network connectivity
- Look for errors in browser console

**Screen share not working:**
- Some browsers require HTTPS for screen sharing
- Try Chrome or Firefox (best support)

## Architecture Overview

### Signaling Flow (WebRTC)
1. User A joins room → Server notifies User B
2. User B creates WebRTC offer → Sends to User A via Socket.io
3. User A receives offer → Creates answer → Sends back
4. Both exchange ICE candidates → Connection established
5. Media streams flow directly between peers (P2P)

### Key Files
- `backend/src/index.ts` - Express + Socket.io server
- `frontend/src/hooks/useWebRTC.ts` - WebRTC peer connection logic
- `frontend/src/components/MeetingRoom.tsx` - Main meeting UI
- `frontend/src/utils/webrtc.ts` - WebRTC utility functions

## Next Steps

- Add TURN servers for better connectivity (see README.md)
- Implement text chat (bonus feature)
- Add participant names/avatars
- Implement reconnection logic

