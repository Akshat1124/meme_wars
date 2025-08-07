import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import MemeUploader from '../components/MemeUploader';
import { memeAPI } from '../api/api';

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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-white text-xl">Loading room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-red-400 text-xl mb-6">{error}</p>
          <button
            onClick={handleBackToHome}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎭 Battle Room</h1>
          <p className="text-gray-300">Room ID: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{roomId}</span></p>
          <button
            onClick={handleBackToHome}
            className="mt-4 text-gray-400 hover:text-white transition duration-200"
          >
            ← Back to Home
          </button>
        </div>

        {memeUploaded ? (
          /* Waiting Screen */
          <div className="text-center">
            <div className="bg-gray-800 rounded-lg p-8 max-w-lg mx-auto">
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-2xl font-bold text-white mb-4">Meme Uploaded!</h2>
              <p className="text-gray-300 mb-6">Waiting for your opponent to upload their meme...</p>
              
              {/* Status indicators */}
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-3">
                  <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                  <span className="text-white">Player {playerNumber} (You) ✅</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <span className={`w-4 h-4 rounded-full ${
                    (playerNumber === 1 && roomData?.meme2) || (playerNumber === 2 && roomData?.meme1)
                      ? 'bg-green-500' : 'bg-gray-500 animate-pulse'
                  }`}></span>
                  <span className="text-white">
                    Player {playerNumber === 1 ? 2 : 1} {
                      (playerNumber === 1 && roomData?.meme2) || (playerNumber === 2 && roomData?.meme1)
                        ? '✅' : '⏳'
                    }
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <p className="text-gray-300 text-sm mb-2">Share this room with your opponent:</p>
                <code className="text-xs bg-gray-800 px-2 py-1 rounded block">
                  {window.location.origin}/room/{roomId}?player={playerNumber === 1 ? 2 : 1}
                </code>
              </div>

              <div className="mt-6 text-gray-400 text-sm">
                <p>🔄 Auto-refreshing every 3 seconds...</p>
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
            <div className="bg-gray-800 rounded-lg p-6 max-w-lg mx-auto">
              <h3 className="text-white font-bold mb-3">🤝 Invite Your Opponent</h3>
              <p className="text-gray-300 text-sm mb-3">
                Share this link for Player {playerNumber === 1 ? 2 : 1}:
              </p>
              <div className="bg-gray-700 p-3 rounded text-xs font-mono text-gray-300 break-all">
                {window.location.origin}/room/{roomId}?player={playerNumber === 1 ? 2 : 1}
              </div>
              <div className="mt-3 text-gray-400 text-xs">
                Or just share the room ID: <span className="font-bold">{roomId}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;
