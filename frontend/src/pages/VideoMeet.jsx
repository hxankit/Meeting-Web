import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import SendIcon from '@mui/icons-material/Send'
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
  "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }]
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg-base: #080c14;
    --bg-surface: rgba(255,255,255,0.04);
    --bg-glass: rgba(255,255,255,0.06);
    --bg-glass-hover: rgba(255,255,255,0.09);
    --border: rgba(255,255,255,0.08);
    --border-bright: rgba(255,255,255,0.18);
    --accent: #4f8eff;
    --accent-dim: rgba(79,142,255,0.18);
    --accent-glow: rgba(79,142,255,0.35);
    --danger: #ff4f6a;
    --danger-dim: rgba(255,79,106,0.18);
    --success: #2ecc8f;
    --text-primary: #f0f4ff;
    --text-secondary: rgba(240,244,255,0.5);
    --text-muted: rgba(240,244,255,0.28);
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius-sm: 10px;
    --radius-md: 16px;
    --radius-lg: 24px;
    --radius-xl: 32px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .meet-root {
    font-family: var(--font-body);
    background: var(--bg-base);
    min-height: 100vh;
    color: var(--text-primary);
    overflow: hidden;
    position: relative;
  }

  /* Ambient background orbs */
  .meet-root::before {
    content: '';
    position: fixed;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(79,142,255,0.12) 0%, transparent 70%);
    top: -200px; left: -200px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .meet-root::after {
    content: '';
    position: fixed;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(255,79,106,0.08) 0%, transparent 70%);
    bottom: -150px; right: -100px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  /* ── LOBBY ── */
  .lobby-wrap {
    position: relative; z-index: 1;
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh;
    padding: 24px;
  }
  .lobby-card {
    background: var(--bg-glass);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 48px 40px;
    width: 100%; max-width: 480px;
    backdrop-filter: blur(24px);
    box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
    display: flex; flex-direction: column; gap: 32px;
    animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lobby-header { display: flex; flex-direction: column; gap: 8px; }
  .lobby-tag {
    font-family: var(--font-display);
    font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--accent);
    display: flex; align-items: center; gap: 8px;
  }
  .lobby-tag::before {
    content: '';
    display: inline-block; width: 6px; height: 6px;
    background: var(--accent); border-radius: 50%;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 0 var(--accent-glow); }
    50% { box-shadow: 0 0 0 8px transparent; }
  }
  .lobby-title {
    font-family: var(--font-display);
    font-size: 32px; font-weight: 700; line-height: 1.1;
    color: var(--text-primary);
  }
  .lobby-subtitle { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }

  .lobby-preview {
    position: relative; border-radius: var(--radius-md);
    overflow: hidden; aspect-ratio: 16/9;
    background: #0d1220;
    border: 1px solid var(--border);
  }
  .lobby-preview video {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  .lobby-preview-badge {
    position: absolute; bottom: 10px; left: 10px;
    background: rgba(0,0,0,0.6); border-radius: 6px;
    padding: 4px 10px; font-size: 11px; color: var(--text-secondary);
    backdrop-filter: blur(8px); border: 1px solid var(--border);
  }

  .lobby-field .MuiOutlinedInput-root {
    background: var(--bg-surface) !important;
    border-radius: var(--radius-sm) !important;
    color: var(--text-primary) !important;
    font-family: var(--font-body) !important;
  }
  .lobby-field .MuiOutlinedInput-notchedOutline {
    border-color: var(--border) !important;
  }
  .lobby-field .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: var(--border-bright) !important;
  }
  .lobby-field .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: var(--accent) !important;
  }
  .lobby-field .MuiInputLabel-root { color: var(--text-muted) !important; font-family: var(--font-body) !important; }
  .lobby-field .MuiInputLabel-root.Mui-focused { color: var(--accent) !important; }
  .lobby-field input { color: var(--text-primary) !important; }

  .lobby-btn {
    width: 100% !important;
    background: var(--accent) !important;
    color: #fff !important;
    font-family: var(--font-display) !important;
    font-size: 15px !important; font-weight: 600 !important;
    letter-spacing: 0.04em !important;
    border-radius: var(--radius-sm) !important;
    padding: 13px 24px !important;
    text-transform: none !important;
    box-shadow: 0 8px 32px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.2) !important;
    transition: all 0.2s ease !important;
  }
  .lobby-btn:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 12px 40px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.2) !important;
    background: #6aa0ff !important;
  }
  .lobby-btn:active { transform: translateY(0) !important; }

  /* ── MEET LAYOUT ── */
  .meet-container {
    position: relative; z-index: 1;
    display: grid;
    grid-template-rows: 1fr auto;
    height: 100vh;
    overflow: hidden;
  }
  .meet-main {
    display: flex;
    gap: 0;
    overflow: hidden;
    position: relative;
  }

  /* ── CONFERENCE GRID ── */
  .conference-area {
    flex: 1;
    padding: 20px;
    display: flex; flex-direction: column;
    gap: 16px;
    overflow: hidden;
  }
  .conference-grid {
    flex: 1;
    display: grid;
    gap: 12px;
    overflow: hidden;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    grid-auto-rows: 1fr;
    align-content: center;
  }
  .video-tile {
    position: relative;
    background: #0d1220;
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--border);
    transition: border-color 0.2s;
  }
  .video-tile:hover { border-color: var(--border-bright); }
  .video-tile video {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  .video-tile-label {
    position: absolute; bottom: 12px; left: 12px;
    background: rgba(0,0,0,0.65); backdrop-filter: blur(8px);
    border-radius: 6px; padding: 4px 10px;
    font-size: 12px; color: var(--text-primary);
    border: 1px solid var(--border);
  }

  /* ── LOCAL VIDEO (PiP) ── */
  .local-video-wrap {
    position: absolute;
    bottom: 100px; right: 24px;
    width: 180px;
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 2px solid var(--border-bright);
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    z-index: 10;
    transition: all 0.2s;
  }
  .local-video-wrap:hover {
    width: 200px;
    box-shadow: 0 12px 48px rgba(0,0,0,0.7);
  }
  .local-video-wrap video {
    width: 100%; display: block; object-fit: cover;
    background: #0d1220;
  }
  .local-video-label {
    position: absolute; bottom: 8px; left: 8px;
    background: rgba(0,0,0,0.65); backdrop-filter: blur(8px);
    border-radius: 5px; padding: 3px 8px;
    font-size: 11px; color: var(--text-primary);
  }

  /* ── CONTROL BAR ── */
  .control-bar {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; padding: 16px 24px;
    background: var(--bg-glass);
    backdrop-filter: blur(24px);
    border-top: 1px solid var(--border);
    position: relative; z-index: 20;
  }

  .ctrl-btn {
    display: flex; align-items: center; justify-content: center;
    width: 48px; height: 48px;
    border-radius: 50%;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.18s ease;
    color: var(--text-primary) !important;
  }
  .ctrl-btn:hover {
    background: var(--bg-glass-hover) !important;
    border-color: var(--border-bright) !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  }
  .ctrl-btn.active {
    background: var(--accent-dim) !important;
    border-color: rgba(79,142,255,0.4) !important;
    color: var(--accent) !important;
  }
  .ctrl-btn.danger {
    background: var(--danger-dim) !important;
    border-color: rgba(255,79,106,0.35) !important;
    color: var(--danger) !important;
    width: 56px; height: 56px;
  }
  .ctrl-btn.danger:hover {
    background: var(--danger) !important;
    color: #fff !important;
    border-color: var(--danger) !important;
  }

  .ctrl-divider {
    width: 1px; height: 28px;
    background: var(--border);
    margin: 0 4px;
  }

  /* ── CHAT PANEL ── */
  .chat-panel {
    width: 320px;
    display: flex; flex-direction: column;
    background: var(--bg-glass);
    backdrop-filter: blur(24px);
    border-left: 1px solid var(--border);
    animation: slideInRight 0.3s cubic-bezier(0.16,1,0.3,1) both;
    overflow: hidden;
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .chat-header {
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .chat-title {
    font-family: var(--font-display);
    font-size: 16px; font-weight: 600; color: var(--text-primary);
    display: flex; align-items: center; gap: 8px;
  }
  .chat-title-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--success);
    animation: pulse 2s infinite;
  }

  .chat-messages {
    flex: 1; overflow-y: auto;
    padding: 16px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .chat-empty {
    text-align: center; color: var(--text-muted);
    font-size: 13px; margin-top: 40px;
  }
  .chat-bubble {
    display: flex; flex-direction: column; gap: 4px;
    animation: fadeIn 0.25s ease both;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .chat-bubble-sender {
    font-size: 11px; font-weight: 600;
    color: var(--accent); letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .chat-bubble-text {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 4px 12px 12px 12px;
    padding: 10px 14px;
    font-size: 13px; color: var(--text-primary);
    line-height: 1.5; word-break: break-word;
  }

  .chat-input-area {
    padding: 16px;
    border-top: 1px solid var(--border);
    display: flex; gap: 10px; align-items: center;
  }
  .chat-input-area .MuiOutlinedInput-root {
    background: var(--bg-surface) !important;
    border-radius: var(--radius-sm) !important;
    color: var(--text-primary) !important;
    font-family: var(--font-body) !important;
    font-size: 13px !important;
  }
  .chat-input-area .MuiOutlinedInput-notchedOutline {
    border-color: var(--border) !important;
  }
  .chat-input-area .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: var(--border-bright) !important;
  }
  .chat-input-area .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: var(--accent) !important;
  }
  .chat-input-area .MuiInputLabel-root { color: var(--text-muted) !important; font-size: 13px !important; }
  .chat-input-area .MuiInputLabel-root.Mui-focused { color: var(--accent) !important; }
  .chat-input-area input { color: var(--text-primary) !important; }

  .send-btn {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; flex-shrink: 0;
    border-radius: 50%;
    background: var(--accent) !important;
    border: none !important;
    cursor: pointer;
    transition: all 0.18s ease;
    color: #fff !important;
    box-shadow: 0 4px 16px var(--accent-glow);
  }
  .send-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px var(--accent-glow);
    background: #6aa0ff !important;
  }
`;

export default function VideoMeetComponent() {
  var socketRef = useRef();
  let socketIdRef = useRef();
  let localVideoref = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);
  let [video, setVideo] = useState([]);
  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();
  let [showModal, setModal] = useState(true);
  let [screenAvailable, setScreenAvailable] = useState();
  let [messages, setMessages] = useState([])
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState(3);
  let [askForUsername, setAskForUsername] = useState(true);
  let [username, setUsername] = useState("");
  const videoRef = useRef([])
  let [videos, setVideos] = useState([])

  useEffect(() => {
    getPermissions();
  })

  let getDislayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
          .then(getDislayMediaSuccess)
          .then(() => {})
          .catch((e) => console.log(e))
      }
    }
  }

  const getPermissions = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoPermission) { setVideoAvailable(true); } else { setVideoAvailable(false); }
        const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (audioPermission) { setAudioAvailable(true); } else { setAudioAvailable(false); }
        if (navigator.mediaDevices.getDisplayMedia) { setScreenAvailable(true); } else { setScreenAvailable(false); }
        if (videoAvailable || audioAvailable) {
          const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
          if (userMediaStream) {
            window.localStream = userMediaStream;
            if (localVideoref.current) { localVideoref.current.srcObject = userMediaStream; }
          }
        }
      } else {
        setVideoAvailable(false);
        setAudioAvailable(false);
        setScreenAvailable(false);
        console.error("getUserMedia is not supported in this browser.");
      }
    } catch (error) { console.log(error); }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) { getUserMedia(); }
  }, [video, audio])

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  }

  let getUserMediaSuccess = (stream) => {
    try { window.localStream.getTracks().forEach(track => track.stop()) } catch (e) { console.log(e) }
    window.localStream = stream;
    localVideoref.current.srcObject = stream;
    for (let id in connections) {
      if (id === socketIdRef.current) continue
      connections[id].addStream(window.localStream)
      connections[id].createOffer().then((description) => {
        connections[id].setLocalDescription(description)
          .then(() => { socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription })) })
          .catch(e => console.log(e))
      })
    }
    stream.getTracks().forEach(track => track.onended = () => {
      setVideo(false); setAudio(false);
      try { let tracks = localVideoref.current.srcObject.getTracks(); tracks.forEach(track => track.stop()) } catch (e) { console.log(e) }
      let blackSilence = (...args) => new MediaStream([black(...args), silence()])
      window.localStream = blackSilence();
      localVideoref.current.srcObject = window.localStream;
      for (let id in connections) {
        connections[id].addStream(window.localStream)
        connections[id].createOffer().then((description) => {
          connections[id].setLocalDescription(description)
            .then(() => { socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription })) })
            .catch(e => console.log(e))
        })
      }
    })
  }

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
          .then(getUserMediaSuccess).then(() => {}).catch((e) => console.log(e))
      } else {
        console.error("getUserMedia is not supported in this browser.");
      }
    } else {
      try { let tracks = localVideoref.current.srcObject.getTracks(); tracks.forEach(track => track.stop()) } catch (e) {}
    }
  }

  let getDislayMediaSuccess = (stream) => {
    try { window.localStream.getTracks().forEach(track => track.stop()) } catch (e) { console.log(e) }
    window.localStream = stream;
    localVideoref.current.srcObject = stream;
    for (let id in connections) {
      if (id === socketIdRef.current) continue
      connections[id].addStream(window.localStream)
      connections[id].createOffer().then((description) => {
        connections[id].setLocalDescription(description)
          .then(() => { socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription })) })
          .catch(e => console.log(e))
      })
    }
    stream.getTracks().forEach(track => track.onended = () => {
      setScreen(false)
      try { let tracks = localVideoref.current.srcObject.getTracks(); tracks.forEach(track => track.stop()) } catch (e) { console.log(e) }
      let blackSilence = (...args) => new MediaStream([black(...args), silence()])
      window.localStream = blackSilence();
      localVideoref.current.srcObject = window.localStream;
      getUserMedia()
    })
  }

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message)
    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
          if (signal.sdp.type === 'offer') {
            connections[fromId].createAnswer().then((description) => {
              connections[fromId].setLocalDescription(description).then(() => {
                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
              }).catch(e => console.log(e))
            }).catch(e => console.log(e))
          }
        }).catch(e => console.log(e))
      }
      if (signal.ice) { connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e)) }
    }
  }

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false })
    socketRef.current.on('signal', gotMessageFromServer)
    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-call', window.location.href)
      socketIdRef.current = socketRef.current.id
      socketRef.current.on('chat-message', addMessage)
      socketRef.current.on('user-left', (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id))
      })
      socketRef.current.on('user-joined', (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) { socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate })) }
          }
          connections[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find(video => video.socketId === socketListId);
            if (videoExists) {
              setVideos(videos => {
                const updatedVideos = videos.map(video =>
                  video.socketId === socketListId ? { ...video, stream: event.stream } : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = { socketId: socketListId, stream: event.stream, autoplay: true, playsinline: true };
              setVideos(videos => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };
          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream)
          } else {
            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            connections[socketListId].addStream(window.localStream)
          }
        })
        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue
            try { connections[id2].addStream(window.localStream) } catch (e) {}
            connections[id2].createOffer().then((description) => {
              connections[id2].setLocalDescription(description)
                .then(() => { socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription })) })
                .catch(e => console.log(e))
            })
          }
        }
      })
    })
  }

  let silence = () => {
    let ctx = new AudioContext()
    let oscillator = ctx.createOscillator()
    let dst = oscillator.connect(ctx.createMediaStreamDestination())
    oscillator.start(); ctx.resume()
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
  }
  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), { width, height })
    canvas.getContext('2d').fillRect(0, 0, width, height)
    let stream = canvas.captureStream()
    return Object.assign(stream.getVideoTracks()[0], { enabled: false })
  }

  let handleVideo = () => { setVideo(!video); }
  let handleAudio = () => { setAudio(!audio); }

  useEffect(() => {
    if (screen !== undefined) { getDislayMedia(); }
  }, [screen])

  let handleScreen = () => { setScreen(!screen); }
  let handleEndCall = () => {
    try { let tracks = localVideoref.current.srcObject.getTracks(); tracks.forEach(track => track.stop()) } catch (e) {}
    window.location.href = "/";
  }

  let openChat = () => { setModal(true); setNewMessages(0); }
  let handleMessage = (e) => { setMessage(e.target.value); }

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [...prevMessages, { sender: sender, data: data }]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let sendMessage = () => {
    socketRef.current.emit('chat-message', message, username)
    setMessage("");
  }

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  }

  return (
    <div className="meet-root">
      <style>{styles}</style>

      {askForUsername ? (
        <div className="lobby-wrap">
          <div className="lobby-card">
            <div className="lobby-header">
              <span className="lobby-tag">Live Meeting</span>
              <h1 className="lobby-title">Join the Room</h1>
              <p className="lobby-subtitle">Set up your camera and microphone before entering.</p>
            </div>

            <div className="lobby-preview">
              <video ref={localVideoref} autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span className="lobby-preview-badge">Preview</span>
            </div>

            <div className="lobby-field">
              <TextField
                fullWidth
                id="outlined-basic"
                label="Your name"
                value={username}
                onChange={e => setUsername(e.target.value)}
                variant="outlined"
                onKeyDown={e => e.key === 'Enter' && connect()}
              />
            </div>

            <Button className="lobby-btn" variant="contained" onClick={connect}>
              Enter Meeting →
            </Button>
          </div>
        </div>
      ) : (
        <div className="meet-container">
          <div className="meet-main">
            {/* Conference area */}
            <div className="conference-area">
              <div className="conference-grid">
                {videos.map((vid) => (
                  <div className="video-tile" key={vid.socketId}>
                    <video
                      data-socket={vid.socketId}
                      ref={ref => { if (ref && vid.stream) { ref.srcObject = vid.stream; } }}
                      autoPlay
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span className="video-tile-label">Participant</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat panel */}
            {showModal && (
              <div className="chat-panel">
                <div className="chat-header">
                  <span className="chat-title">
                    <span className="chat-title-dot" />
                    Chat
                  </span>
                  <IconButton onClick={() => setModal(false)} size="small" style={{ color: 'rgba(240,244,255,0.4)' }}>
                    ✕
                  </IconButton>
                </div>

                <div className="chat-messages">
                  {messages.length === 0
                    ? <p className="chat-empty">No messages yet.<br />Say hello 👋</p>
                    : messages.map((item, index) => (
                        <div className="chat-bubble" key={index}>
                          <span className="chat-bubble-sender">{item.sender}</span>
                          <div className="chat-bubble-text">{item.data}</div>
                        </div>
                      ))
                  }
                </div>

                <div className="chat-input-area">
                  <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    label="Message…"
                    variant="outlined"
                    size="small"
                    style={{ flex: 1 }}
                  />
                  <IconButton className="send-btn" onClick={sendMessage}>
                    <SendIcon style={{ fontSize: 18 }} />
                  </IconButton>
                </div>
              </div>
            )}
          </div>

          {/* Local PiP video */}
          <div className="local-video-wrap">
            <video ref={localVideoref} autoPlay muted />
            <span className="local-video-label">You</span>
          </div>

          {/* Control bar */}
          <div className="control-bar">
            <IconButton
              className={`ctrl-btn ${video ? 'active' : ''}`}
              onClick={handleVideo}
            >
              {video ? <VideocamIcon fontSize="small" /> : <VideocamOffIcon fontSize="small" />}
            </IconButton>

            <IconButton
              className={`ctrl-btn ${audio ? 'active' : ''}`}
              onClick={handleAudio}
            >
              {audio ? <MicIcon fontSize="small" /> : <MicOffIcon fontSize="small" />}
            </IconButton>

            <div className="ctrl-divider" />

            <IconButton className="ctrl-btn danger" onClick={handleEndCall}>
              <CallEndIcon fontSize="small" />
            </IconButton>

            <div className="ctrl-divider" />

            {screenAvailable && (
              <IconButton
                className={`ctrl-btn ${screen ? 'active' : ''}`}
                onClick={handleScreen}
              >
                {screen ? <ScreenShareIcon fontSize="small" /> : <StopScreenShareIcon fontSize="small" />}
              </IconButton>
            )}

            <Badge badgeContent={newMessages} max={999} color="primary">
              <IconButton
                className={`ctrl-btn ${showModal ? 'active' : ''}`}
                onClick={() => { setModal(!showModal); setNewMessages(0); }}
              >
                <ChatIcon fontSize="small" />
              </IconButton>
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
}