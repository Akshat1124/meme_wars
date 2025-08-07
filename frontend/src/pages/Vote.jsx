import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VoteScreen from '../components/VoteScreen.jsx';
import { Home, Target, Lightning } from '../components/icons/GameIcons.jsx';

const Vote = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const handleVoteComplete = () => {
    // After voting, redirect to results page
    navigate(`/result/${roomId}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen p-4 relative">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Target size={32} className="text-red-400" />
            <h1 className="text-4xl font-bold text-white glitch" data-text="BATTLE ARENA">BATTLE ARENA</h1>
            <Target size={32} className="text-red-400" />
          </div>
          <div className="inline-flex items-center space-x-2 bg-red-600/20 border border-red-500/30 text-red-300 px-4 py-2 rounded-full backdrop-blur-sm font-mono">
            <Lightning size={16} />
            <span>BATTLE ID: {roomId}</span>
          </div>
          <button
            onClick={handleBackToHome}
            className="mt-4 text-gray-400 hover:text-white transition duration-200 flex items-center justify-center space-x-2 mx-auto"
          >
            <Home size={16} />
            <span>← Retreat to Base</span>
          </button>
        </div>

        {/* Vote Screen Component */}
        <VoteScreen 
          roomId={roomId} 
          onVoteComplete={handleVoteComplete}
        />

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <div className="text-gray-400 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <Lightning size={16} className="text-purple-400" />
              <span>Powered by Battle Protocol • May the best meme win</span>
              <Lightning size={16} className="text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vote;
