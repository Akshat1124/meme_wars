import { useParams, useNavigate } from 'react-router-dom';
import ResultScreen from '../components/ResultScreen';

const Result = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

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

        {/* Result Screen Component */}
        <ResultScreen 
          roomId={roomId} 
          onBackToHome={handleBackToHome}
        />

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <div className="text-gray-400 text-sm space-y-1">
            <p>🎮 Powered by Meme Wars</p>
            <p>Want to start another battle? Click "Start New Battle" above!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
