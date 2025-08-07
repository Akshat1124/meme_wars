import { useState, useEffect } from 'react';
import { memeAPI } from '../api/api.js';
import { Crown, Trophy, ChartBar, Share, Copy, Home, Users, Lightning, Star } from './icons/GameIcons.jsx';

const ResultScreen = ({ roomId, onBackToHome }) => {
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoomData();
    // Auto-refresh every 5 seconds to get updated vote counts
    const interval = setInterval(fetchRoomData, 5000);
    return () => clearInterval(interval);
  }, [roomId]);

  const fetchRoomData = async () => {
    try {
      const data = await memeAPI.getRoom(roomId);
      setRoomData(data);
    } catch (err) {
      setError('Failed to load battle results');
    } finally {
      setLoading(false);
    }
  };

  const getWinner = () => {
    if (!roomData) return null;
    
    const votes1 = roomData.votes1 || 0;
    const votes2 = roomData.votes2 || 0;
    
    if (votes1 > votes2) return { winner: 1, votes: votes1, loserVotes: votes2 };
    if (votes2 > votes1) return { winner: 2, votes: votes2, loserVotes: votes1 };
    return { winner: 'tie', votes: votes1, loserVotes: votes2 };
  };

  const copyShareLink = () => {
    const voteLink = `${window.location.origin}/vote/${roomId}`;
    navigator.clipboard.writeText(voteLink);
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="game-card text-center">
          <div className="spinner-game mx-auto mb-4" style={{width: '64px', height: '64px'}}></div>
          <p className="text-white text-xl">Loading battle results...</p>
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
          <button
            onClick={onBackToHome}
            className="mt-4 btn-game bg-gradient-to-r from-purple-600 to-blue-600"
          >
            <div className="flex items-center justify-center space-x-2">
              <Home size={18} />
              <span>BACK TO HOME</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  const winner = getWinner();
  const totalVotes = (roomData?.votes1 || 0) + (roomData?.votes2 || 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="battle-arena">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Trophy size={32} className="text-yellow-400" />
            <h1 className="text-4xl font-bold text-white glitch" data-text="BATTLE RESULTS">
              BATTLE RESULTS
            </h1>
            <Trophy size={32} className="text-yellow-400" />
          </div>
          <p className="text-gray-400 font-mono">Battle ID: {roomId}</p>
          <div className="mt-4 inline-flex items-center space-x-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full backdrop-blur-sm">
            <Users size={16} />
            <span className="font-bold">{totalVotes} TOTAL VOTES</span>
          </div>
        </div>

        {/* Winner Announcement */}
        {winner && totalVotes > 0 && (
          <div className="text-center mb-8">
            {winner.winner === 'tie' ? (
              <div className="winner-announcement bg-gradient-to-r from-yellow-600 to-orange-600">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Star size={48} className="text-white" />
                  <Star size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-black">EPIC TIE!</h2>
                <p className="text-xl mt-2 text-black">Both fighters are equally legendary! ({winner.votes} votes each)</p>
              </div>
            ) : (
              <div className="winner-announcement">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Crown size={48} className="text-black" />
                  <Trophy size={48} className="text-black" />
                  <Crown size={48} className="text-black" />
                </div>
                <h2 className="text-3xl font-bold text-black">FIGHTER {winner.winner} VICTORIOUS!</h2>
                <p className="text-xl mt-2 text-black">{winner.votes} votes defeats {winner.loserVotes} votes</p>
              </div>
            )}
          </div>
        )}

        {/* Memes Display */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Meme 1 */}
          <div className={`game-card ${winner?.winner === 1 ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-400/50' : 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/30'}`}>
            <div className="text-center mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy size={24} className={winner?.winner === 1 ? 'text-yellow-400' : 'text-blue-400'} />
                <h3 className="text-xl font-bold text-white">FIGHTER 1</h3>
                {winner?.winner === 1 && <Crown size={24} className="text-yellow-400" />}
              </div>
              <div className="text-lg font-bold">
                <span className="text-blue-400">{roomData?.votes1 || 0} VOTES</span>
                {totalVotes > 0 && (
                  <div className="text-gray-400 text-sm mt-1">
                    ({Math.round(((roomData?.votes1 || 0) / totalVotes) * 100)}% of battle)
                  </div>
                )}
              </div>
            </div>
            
            {roomData?.meme1 && (
              <div className="meme-container mb-4">
                <img
                  src={roomData.meme1}
                  alt="Fighter 1 Weapon"
                  className="w-full max-h-80 object-contain rounded-lg shadow-lg"
                />
                {winner?.winner === 1 && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                    VICTOR
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Meme 2 */}
          <div className={`game-card ${winner?.winner === 2 ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-400/50' : 'bg-gradient-to-br from-red-900/50 to-orange-900/50 border-red-500/30'}`}>
            <div className="text-center mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy size={24} className={winner?.winner === 2 ? 'text-yellow-400' : 'text-red-400'} />
                <h3 className="text-xl font-bold text-white">FIGHTER 2</h3>
                {winner?.winner === 2 && <Crown size={24} className="text-yellow-400" />}
              </div>
              <div className="text-lg font-bold">
                <span className="text-red-400">{roomData?.votes2 || 0} VOTES</span>
                {totalVotes > 0 && (
                  <div className="text-gray-400 text-sm mt-1">
                    ({Math.round(((roomData?.votes2 || 0) / totalVotes) * 100)}% of battle)
                  </div>
                )}
              </div>
            </div>
            
            {roomData?.meme2 && (
              <div className="meme-container mb-4">
                <img
                  src={roomData.meme2}
                  alt="Fighter 2 Weapon"
                  className="w-full max-h-80 object-contain rounded-lg shadow-lg"
                />
                {winner?.winner === 2 && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                    VICTOR
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bars */}
        {totalVotes > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <ChartBar size={20} className="text-purple-400" />
              <h3 className="text-white text-lg font-bold">BATTLE STATISTICS</h3>
              <ChartBar size={20} className="text-purple-400" />
            </div>
            <div className="space-y-4">
              <div className="game-card bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span className="font-bold">FIGHTER 1</span>
                  <span>{roomData?.votes1 || 0} votes</span>
                </div>
                <div className="progress-bar-game h-4 rounded">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded transition-all duration-1000"
                    style={{ width: `${((roomData?.votes1 || 0) / totalVotes) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="game-card bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-500/30">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span className="font-bold">FIGHTER 2</span>
                  <span>{roomData?.votes2 || 0} votes</span>
                </div>
                <div className="progress-bar-game h-4 rounded">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-4 rounded transition-all duration-1000"
                    style={{ width: `${((roomData?.votes2 || 0) / totalVotes) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="game-card bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30 mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Share size={20} className="text-purple-400" />
            <h3 className="text-white text-lg font-bold">EXPAND THE BATTLE</h3>
            <Lightning size={20} className="text-yellow-400" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={`${window.location.origin}/vote/${roomId}`}
              readOnly
              className="flex-1 game-input text-sm font-mono"
            />
            <button
              onClick={copyShareLink}
              className="btn-game bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
            >
              <div className="flex items-center justify-center space-x-2">
                <Copy size={16} />
                <span>COPY LINK</span>
              </div>
            </button>
          </div>
          <p className="text-gray-400 text-sm text-center mt-2">
            Share this arena to let more warriors join the vote!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={onBackToHome}
            className="btn-game bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8"
          >
            <div className="flex items-center justify-center space-x-2">
              <Home size={18} />
              <span>START NEW BATTLE</span>
            </div>
          </button>
          
          <div className="game-card bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-600/30 inline-block">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Lightning size={16} className="text-yellow-400" />
              <span>Results update automatically every 5 seconds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
