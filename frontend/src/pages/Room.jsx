import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import MemeUploader from '../components/MemeUploader.jsx';
import { memeAPI } from '../api/api.js';
import { Home, Loading, Check, Target, Users, Lightning, Shield, Sword } from '../components/icons/GameIcons.jsx';

const Room = () => {
  const { id: roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const playerNumber = parseInt(searchParams.get('player')) || 1;
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [memeUploaded, setMemeUploaded] = useState(false);

  useEffect(() => {
    fetchRoomData();
    // Poll for room updates every 3 seconds
    const interval = setInterval(fetchRoomData, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  const fetchRoomData = async () => {
    try {
      const data = await memeAPI.getRoom(roomId);
      setRoomData(data);
      
      // Check if current player has uploaded their meme
      const playerMemeKey = `meme${playerNumber}`;
      setMemeUploaded(!!data[playerMemeKey]);
      
      // If both memes are uploaded, redirect to voting
      if (data.meme1 && data.meme2) {
        navigate(`/vote/${roomId}`);
      }
    } catch (err) {
      setError('Room not found or failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleMemeUploaded = (response) => {
    setMemeUploaded(true);
    fetchRoomData(); // Refresh room data
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Loading size={64} className="mx-auto mb-4 text-purple-400" />
          <p className="text-white text-xl">Connecting to battle station...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="game-card">
            <div className="text-6xl mb-4 text-red-400">⚠</div>
            <p className="text-red-400 text-xl mb-6">{error}</p>
            <button
              onClick={handleBackToHome}
              className="btn-game bg-gradient-to-r from-purple-600 to-blue-600"
            >
              <div className="flex items-center justify-center space-x-2">
                <Home size={18} />
                <span>RETURN TO BASE</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 relative">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Target size={32} className="text-purple-400" />
            <h1 className="text-4xl font-bold text-white glitch" data-text="BATTLE STATION">BATTLE STATION</h1>
            <Target size={32} className="text-purple-400" />
          </div>
          <div className="inline-flex items-center space-x-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full backdrop-blur-sm font-mono">
            <Lightning size={16} />
            <span>ROOM: {roomId}</span>
          </div>
          <button
            onClick={handleBackToHome}
            className="mt-4 text-gray-400 hover:text-white transition duration-200 flex items-center justify-center space-x-2 mx-auto"
          >
            <Home size={16} />
            <span>← Back to Base</span>
          </button>
        </div>

        {memeUploaded ? (
          /* Waiting Screen */
          <div className="text-center">
            <div className="game-card max-w-lg mx-auto">
              <Check size={80} className="mx-auto text-green-400 mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">WEAPON DEPLOYED!</h2>
              <p className="text-gray-300 mb-6">Waiting for enemy combatant to deploy their weapon...</p>
              
              {/* Status indicators */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full status-online"></div>
                  <Sword size={20} className="text-green-400" />
                  <span className="text-white font-semibold">Fighter {playerNumber} (You) READY</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    (playerNumber === 1 && roomData?.meme2) || (playerNumber === 2 && roomData?.meme1)
                      ? 'status-online' : 'status-waiting'
                  }`}></div>
                  <Shield size={20} className={
                    (playerNumber === 1 && roomData?.meme2) || (playerNumber === 2 && roomData?.meme1)
                      ? 'text-green-400' : 'text-gray-400'
                  } />
                  <span className="text-white font-semibold">
                    Fighter {playerNumber === 1 ? 2 : 1} {
                      (playerNumber === 1 && roomData?.meme2) || (playerNumber === 2 && roomData?.meme1)
                        ? 'READY' : 'PREPARING'
                    }
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div className="game-card bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Users size={16} className="text-blue-400" />
                    <span className="text-blue-300 font-semibold text-sm">ENEMY RECRUITMENT</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">Share this with your opponent:</p>
                  <code className="text-xs bg-gray-800/80 border border-gray-600/30 px-2 py-1 rounded block font-mono backdrop-blur-sm">
                    {window.location.origin}/room/{roomId}?player={playerNumber === 1 ? 2 : 1}
                  </code>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center space-x-2 text-gray-400 text-sm">
                <Loading size={16} />
                <span>Auto-scanning for enemies every 3 seconds...</span>
              </div>
            </div>
          </div>
        ) : (
          /* Upload Screen */
          <MemeUploader
            roomId={roomId}
            playerNumber={playerNumber}
            onMemeUploaded={handleMemeUploaded}
          />
        )}

        {/* Room sharing section */}
        {!memeUploaded && (
          <div className="mt-8 text-center">
            <div className="game-card max-w-lg mx-auto bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-500/30">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Users size={20} className="text-orange-400" />
                <h3 className="text-white font-bold">RECRUIT YOUR OPPONENT</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Deploy this link to Fighter {playerNumber === 1 ? 2 : 1}:
              </p>
              <div className="bg-gray-800/80 border border-gray-600/30 p-3 rounded text-xs font-mono text-gray-300 break-all backdrop-blur-sm">
                {window.location.origin}/room/{roomId}?player={playerNumber === 1 ? 2 : 1}
              </div>
              <div className="mt-3 flex items-center justify-center space-x-2 text-gray-400 text-xs">
                <Lightning size={12} />
                <span>Or share the battle code: <span className="font-bold text-white">{roomId}</span></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;
