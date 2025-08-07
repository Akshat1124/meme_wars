import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomForm from '../components/RoomForm';

const Home = () => {
  const navigate = useNavigate();

  const handleRoomCreated = (roomId) => {
    // Navigate to room page as player 1
    navigate(`/room/${roomId}?player=1`);
  };

  const handleRoomJoined = (roomId) => {
    // Navigate to room page as player 2
    navigate(`/room/${roomId}?player=2`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">🎭</h1>
          <h1 className="text-4xl font-bold text-white mb-2">Meme Wars</h1>
          <p className="text-gray-300 text-lg">The ultimate meme battle arena!</p>
        </div>
        
        <RoomForm 
          onRoomCreated={handleRoomCreated}
          onRoomJoined={handleRoomJoined}
        />
        
        <div className="mt-8 text-center text-gray-400">
          <h3 className="font-bold mb-2">How it works:</h3>
          <div className="text-sm space-y-1">
            <p>1. 🎯 Create or join a room</p>
            <p>2. 📸 Upload your best meme</p>
            <p>3. 🤝 Wait for your opponent</p>
            <p>4. 🗳️ Let the world vote!</p>
            <p>5. 🏆 See who wins!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
