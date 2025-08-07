import { useState, useRef } from 'react';
import { memeAPI } from '../api/api.js';
import { Camera, Rocket, Times, Lightning, Target } from './icons/GameIcons.jsx';

const MemeUploader = ({ roomId, playerNumber, onMemeUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file for your weapon');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB for optimal battle performance');
      return;
    }

    setSelectedFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select your meme weapon first');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await memeAPI.uploadMeme(roomId, selectedFile, playerNumber);
      onMemeUploaded(response);
    } catch (err) {
      setError('Failed to deploy meme weapon. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const event = { target: { files } };
      handleFileSelect(event);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="game-card battle-arena">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Lightning size={24} className="text-yellow-400 animate-pulse" />
            <h2 className="text-2xl font-bold text-white">WEAPON DEPLOYMENT</h2>
            <Lightning size={24} className="text-yellow-400 animate-pulse" />
          </div>
        </div>
        
        <div className="text-center mb-4">
          <div className="inline-flex items-center space-x-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
            <Target size={16} />
            <span className="font-bold">FIGHTER {playerNumber}</span>
            <span>•</span>
            <span className="font-mono">ROOM: {roomId}</span>
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

        {/* File Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-purple-500/50 hover:border-cyan-500/50 rounded-lg p-8 text-center cursor-pointer transition-all duration-300 mb-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm"
        >
          {preview ? (
            <div className="space-y-4">
              <div className="relative meme-container">
                <img
                  src={preview}
                  alt="Meme weapon preview"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                  READY
                </div>
              </div>
              <p className="text-gray-300 text-sm font-mono">{selectedFile?.name}</p>
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <Target size={16} />
                <span className="text-sm font-semibold">WEAPON LOADED</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Camera size={64} className="mx-auto text-purple-400" />
              <div>
                <p className="text-white text-lg font-bold">Deploy Your Meme Weapon</p>
                <p className="text-gray-400">Drag & drop or click to select</p>
                <div className="mt-2 flex items-center justify-center space-x-2 text-gray-500 text-sm">
                  <Lightning size={14} />
                  <span>PNG, JPG, GIF up to 5MB</span>
                  <Lightning size={14} />
                </div>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Action Buttons */}
        <div className="space-y-4">
          {selectedFile && (
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
                setError('');
              }}
              className="w-full bg-gray-600/80 hover:bg-gray-700/80 text-gray-300 font-bold py-2 px-4 rounded-lg transition duration-300 backdrop-blur-sm border border-gray-500/30"
            >
              <div className="flex items-center justify-center space-x-2">
                <Times size={16} />
                <span>CLEAR WEAPON</span>
              </div>
            </button>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full btn-game bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-600"
          >
            {uploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="spinner-game"></div>
                <span>DEPLOYING WEAPON...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Rocket size={18} />
                <span>DEPLOY MEME WEAPON</span>
              </div>
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <div className="game-card bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target size={16} className="text-yellow-400" />
              <span className="text-yellow-300 font-semibold text-sm">TACTICAL ADVICE</span>
              <Target size={16} className="text-yellow-400" />
            </div>
            <p className="text-xs text-gray-400">Choose your most powerful meme - this is your weapon in the ultimate battle!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeUploader;
