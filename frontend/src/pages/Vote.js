import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VoteScreen from '../components/VoteScreen';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <button
            onClick={handleBackToHome}
            className="text-gray-400 hover:text-white transition duration-200 mb-4"
          >
            ← Back to Home
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
            <p>🎮 Powered by Meme Wars • Made for epic battles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vote;
