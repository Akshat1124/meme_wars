import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🤔</div>
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <h2 className="text-xl text-gray-300 mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          Looks like this meme battle doesn't exist or has ended.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
        >
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
