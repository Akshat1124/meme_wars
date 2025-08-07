import { useNavigate } from 'react-router-dom';
import { Home, Target } from '../components/icons/GameIcons.jsx';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="text-center max-w-md">
        <div className="game-card">
          <Target size={80} className="mx-auto mb-6 text-red-400" />
          <h1 className="text-6xl font-bold text-white mb-4 glitch" data-text="404">404</h1>
          <h2 className="text-2xl text-red-400 mb-6 flex items-center justify-center space-x-2">
            <Target size={24} />
            <span>TARGET NOT FOUND</span>
            <Target size={24} />
          </h2>
          <p className="text-gray-300 mb-8">
            This battle zone is either classified or has been destroyed in combat.
            Return to base immediately for reassignment.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-game bg-gradient-to-r from-purple-600 to-blue-600"
          >
            <div className="flex items-center justify-center space-x-2">
              <Home size={20} />
              <span>RETURN TO BASE</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
