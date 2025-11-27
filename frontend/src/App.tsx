import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MeetingRoom } from "./pages/MeetingRoom";
import "./styles/App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room/:roomId" element={<MeetingRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
