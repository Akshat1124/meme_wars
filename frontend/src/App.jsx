
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Room from './pages/Room.jsx';
import Vote from './pages/Vote.jsx';
import Result from './pages/Result.jsx';
import NotFound from './pages/NotFound.jsx';
import HUD from './components/HUD.jsx';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="App">
        <HUD />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<Room />} />
          <Route path="/vote/:roomId" element={<Vote />} />
          <Route path="/result/:roomId" element={<Result />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}


