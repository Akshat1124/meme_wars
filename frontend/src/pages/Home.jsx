import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomForm from '../components/RoomForm.jsx';
import { GameController, Battle, Lightning, Target } from '../components/icons/GameIcons.jsx';

const Home = () => {
  const [showRoomForm, setShowRoomForm] = useState(false);
  const navigate = useNavigate();

  const handleRoomCreated = (roomId) => {
    navigate(`/room/${roomId}?player=1`);
  };

  const handleRoomJoined = (roomId) => {
    navigate(`/room/${roomId}?player=2`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-space px-4 py-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-extrabold glitch text-white mb-2" data-text="MEME WAR">MEME WAR</h1>
        <p className="text-lg md:text-2xl text-cyan-200 font-mono mb-4">The ultimate meme competition in the galaxy!</p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <button className="btn-game flex-1 text-lg" onClick={() => setShowRoomForm(true)}>
            <Battle size={28} className="mr-2" /> Create New Battle
          </button>
          <button className="btn-game flex-1 text-lg" onClick={() => handleRoomJoined('DEMO123')}>
            <GameController size={28} className="mr-2" /> Join Demo Battle
          </button>
        </div>
        {showRoomForm && (
          <div className="game-card w-full max-w-md mx-auto mt-8">
            <RoomForm onRoomCreated={handleRoomCreated} />
          </div>
        )}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Demo Room ID: <span className="font-mono text-cyan-300">DEMO123</span></p>
        </div>
      </div>
    </div>
  );
}

export default Home;
