import { useState } from 'react';
import { memeAPI } from '../api/api.js';
import { Rocket, Shield, Loading, Lightning, Target } from './icons/GameIcons.jsx';

const RoomForm = ({ onRoomCreated, onRoomJoined }) => {
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRoom = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await memeAPI.createRoom();
      onRoomCreated(response.roomId);
    } catch (err) {
      setError('Failed to initialize battle room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      setError('Please enter a battle room ID');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await memeAPI.joinRoom(roomId);
      onRoomJoined(roomId);
    } catch (err) {
      setError('Battle room not found or access denied. Check the room ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Lightning size={24} className="text-yellow-400 animate-pulse" />
          <h2 className="text-2xl font-bold text-white">BATTLE ROOM</h2>
          <Lightning size={24} className="text-yellow-400 animate-pulse" />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900/80 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-center backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-red-400">⚠</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Create Room Section */}
        <div className="text-center">
          <div className="game-card bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Rocket size={20} className="text-purple-400" />
              <h3 className="text-lg font-bold text-white">INITIATE NEW BATTLE</h3>
            </div>
            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full btn-game bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="spinner-game"></div>
                  <span>INITIALIZING...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Rocket size={18} />
                  <span>CREATE BATTLE ROOM</span>
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-600"></div>
            <span className="text-gray-400 font-bold">OR</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-600"></div>
          </div>
        </div>

        {/* Join Room Section */}
        <div>
          <div className="game-card bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield size={20} className="text-blue-400" />
              <h3 className="text-lg font-bold text-white">JOIN EXISTING BATTLE</h3>
            </div>
            <input
              type="text"
              placeholder="Enter Battle Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="w-full game-input mb-4 text-center font-mono tracking-wider"
              maxLength={10}
            />
            <button
              onClick={handleJoinRoom}
              disabled={loading || !roomId.trim()}
              className="w-full btn-game bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="spinner-game"></div>
                  <span>CONNECTING...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Target size={18} />
                  <span>JOIN BATTLE</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="game-card bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-600/30">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Lightning size={16} className="text-yellow-400" />
            <span className="text-gray-300 font-semibold text-sm">BATTLE INFO</span>
            <Lightning size={16} className="text-yellow-400" />
          </div>
          <p className="text-xs text-gray-400">Create a room to get a unique battle ID, or join with a friend's room code!</p>
        </div>
      </div>
    </div>
  );
};

export default RoomForm;
