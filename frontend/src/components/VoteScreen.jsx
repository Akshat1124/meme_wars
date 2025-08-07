import { useState, useEffect } from 'react';
import { memeAPI } from '../api/api.js';
import { Loading, Battle, Vote, Check, Users, ChartBar, Sword, Shield } from './icons/GameIcons.jsx';

const VoteScreen = ({ roomId, onVoteComplete }) => {
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoomData();
    // Check if user has already voted (using localStorage)
    const votedRooms = JSON.parse(localStorage.getItem('votedRooms') || '[]');
    setHasVoted(votedRooms.includes(roomId));
  }, [roomId]);

  const fetchRoomData = async () => {
    try {
      const data = await memeAPI.getRoom(roomId);
      setRoomData(data);
    } catch (err) {
      setError('Failed to load battle data');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (memeChoice) => {
    if (hasVoted) return;

    setVoting(true);
    setError('');

    try {
      await memeAPI.vote(roomId, memeChoice);
      
      // Mark as voted in localStorage
      const votedRooms = JSON.parse(localStorage.getItem('votedRooms') || '[]');
      votedRooms.push(roomId);
      localStorage.setItem('votedRooms', JSON.stringify(votedRooms));
      
      setHasVoted(true);
      onVoteComplete();
    } catch (err) {
      setError('Failed to submit vote. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="game-card text-center">
          <Loading size={64} className="mx-auto mb-4 text-purple-400" />
          <p className="text-white text-xl">Loading battle arena...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="game-card text-center">
          <div className="text-6xl mb-4 text-red-400">⚠</div>
          <p className="text-red-400 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  if (!roomData?.meme1 || !roomData?.meme2) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="game-card text-center">
          <Loading size={64} className="mx-auto mb-6 text-yellow-400" />
          <h2 className="text-white text-2xl mb-4 font-bold">PREPARING BATTLE ARENA</h2>
          <p className="text-gray-400 mb-6">Waiting for all fighters to deploy weapons...</p>
          <p className="text-gray-500 font-mono">Battle ID: {roomId}</p>
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${roomData?.meme1 ? 'status-online' : 'status-waiting'}`}></div>
              <Sword size={16} className={roomData?.meme1 ? 'text-green-400' : 'text-gray-400'} />
              <span className="text-white">Fighter 1 {roomData?.meme1 ? 'READY' : 'PREPARING'}</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${roomData?.meme2 ? 'status-online' : 'status-waiting'}`}></div>
              <Shield size={16} className={roomData?.meme2 ? 'text-green-400' : 'text-gray-400'} />
              <span className="text-white">Fighter 2 {roomData?.meme2 ? 'READY' : 'PREPARING'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="battle-arena">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Battle size={32} className="text-red-400 animate-pulse" />
            <h1 className="text-4xl font-bold text-white glitch" data-text="MEME BATTLE ARENA">
              MEME BATTLE ARENA
            </h1>
            <Battle size={32} className="text-blue-400 animate-pulse" />
          </div>
          <p className="text-gray-400 font-mono">Battle ID: {roomId}</p>
          {hasVoted && (
            <div className="mt-4 inline-flex items-center space-x-2 bg-green-600/20 border border-green-500/30 text-green-300 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Check size={16} />
              <span className="font-semibold">VOTE SUBMITTED! Thanks for participating!</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-900/80 border border-red-500 text-red-200 p-3 rounded-lg mb-6 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-red-400">⚠</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 relative">
          {/* Meme 1 */}
          <div className="game-card bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/30">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Sword size={24} className="text-blue-400" />
                <h3 className="text-xl font-bold text-white">FIGHTER 1</h3>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <ChartBar size={16} />
                <span>Votes: <span className="font-bold text-blue-400">{roomData.votes1 || 0}</span></span>
              </div>
            </div>
            
            <div className="mb-6 meme-container">
              <img
                src={roomData.meme1}
                alt="Fighter 1 Weapon"
                className="w-full max-h-80 object-contain rounded-lg shadow-lg"
              />
              <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                WEAPON 1
              </div>
            </div>

            <button
              onClick={() => handleVote(1)}
              disabled={hasVoted || voting}
              className={`w-full font-bold py-3 px-6 rounded-lg transition duration-300 ${
                hasVoted
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed border border-gray-500/30'
                  : 'btn-game bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
              }`}
            >
              {voting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="spinner-game"></div>
                  <span>SUBMITTING VOTE...</span>
                </div>
              ) : hasVoted ? (
                <div className="flex items-center justify-center space-x-2">
                  <Check size={18} />
                  <span>VOTE SUBMITTED</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Vote size={18} />
                  <span>VOTE FOR FIGHTER 1</span>
                </div>
              )}
            </button>
          </div>

          {/* VS Divider */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
            <div className="vs-battle bg-red-600 text-white font-bold text-3xl px-6 py-3 rounded-full shadow-lg border-4 border-white">
              VS
            </div>
          </div>

          {/* Meme 2 */}
          <div className="game-card bg-gradient-to-br from-red-900/50 to-orange-900/50 border-red-500/30">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Shield size={24} className="text-red-400" />
                <h3 className="text-xl font-bold text-white">FIGHTER 2</h3>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <ChartBar size={16} />
                <span>Votes: <span className="font-bold text-red-400">{roomData.votes2 || 0}</span></span>
              </div>
            </div>
            
            <div className="mb-6 meme-container">
              <img
                src={roomData.meme2}
                alt="Fighter 2 Weapon"
                className="w-full max-h-80 object-contain rounded-lg shadow-lg"
              />
              <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                WEAPON 2
              </div>
            </div>

            <button
              onClick={() => handleVote(2)}
              disabled={hasVoted || voting}
              className={`w-full font-bold py-3 px-6 rounded-lg transition duration-300 ${
                hasVoted
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed border border-gray-500/30'
                  : 'btn-game bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500'
              }`}
            >
              {voting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="spinner-game"></div>
                  <span>SUBMITTING VOTE...</span>
                </div>
              ) : hasVoted ? (
                <div className="flex items-center justify-center space-x-2">
                  <Check size={18} />
                  <span>VOTE SUBMITTED</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Vote size={18} />
                  <span>VOTE FOR FIGHTER 2</span>
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="game-card bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-600/30 inline-block">
            <div className="flex items-center space-x-2">
              <Users size={20} className="text-purple-400" />
              <p className="text-gray-300">
                <span className="font-bold text-white">{(roomData.votes1 || 0) + (roomData.votes2 || 0)}</span> Battle Participants
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p className="mb-2">Share this battle arena with friends to get more votes!</p>
          <code className="bg-gray-800/80 border border-gray-600/30 px-3 py-1 rounded text-xs font-mono backdrop-blur-sm">
            {window.location.href}
          </code>
        </div>
      </div>
    </div>
  );
};

export default VoteScreen;
