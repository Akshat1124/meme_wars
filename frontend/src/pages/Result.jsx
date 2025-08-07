import { useParams, useNavigate } from 'react-router-dom';
import ResultScreen from '../components/ResultScreen.jsx';
import { Home, Trophy, Lightning } from '../components/icons/GameIcons.jsx';

const Result = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen p-4 relative">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Trophy size={32} className="text-yellow-400" />
            <h1 className="text-4xl font-bold text-white glitch" data-text="BATTLE RESULTS">BATTLE RESULTS</h1>
            <Trophy size={32} className="text-yellow-400" />
          </div>
          <div className="inline-flex items-center space-x-2 bg-yellow-600/20 border border-yellow-500/30 text-yellow-300 px-4 py-2 rounded-full backdrop-blur-sm font-mono">
            <Lightning size={16} />
            <span>BATTLE ID: {roomId}</span>
          </div>
          <button
            onClick={handleBackToHome}
            className="mt-4 text-gray-400 hover:text-white transition duration-200 flex items-center justify-center space-x-2 mx-auto"
          >
            <Home size={16} />
            <span>← Return to Command Center</span>
          </button>
        </div>

        {/* Result Screen Component */}
        <ResultScreen 
          roomId={roomId} 
          onBackToHome={handleBackToHome}
        />

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <div className="text-gray-400 text-sm space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Lightning size={16} className="text-purple-400" />
              <span>Powered by Battle Protocol</span>
              <Lightning size={16} className="text-purple-400" />
            </div>
            <p>Ready for another epic battle? Deploy new weapons above!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
