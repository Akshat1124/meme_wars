import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Backend server URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints for meme battle
export const memeAPI = {
  // Create a new room
  createRoom: async () => {
    try {
      const response = await api.post('/createRoom');
      return response.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  // Get room data
  getRoom: async (roomId) => {
    try {
      const response = await api.get(`/room/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  },

  // Upload meme to room
  uploadMeme: async (roomId, memeFile, playerNumber) => {
    try {
      const formData = new FormData();
      formData.append('meme', memeFile);
      formData.append('roomId', roomId);
      formData.append('playerNumber', playerNumber);

      const response = await api.post('/uploadMeme', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading meme:', error);
      throw error;
    }
  },

  // Vote for a meme
  vote: async (roomId, memeChoice) => {
    try {
      const response = await api.post('/vote', {
        roomId,
        memeChoice, // 1 or 2
      });
      return response.data;
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  },

  // Join existing room
  joinRoom: async (roomId) => {
    try {
      const response = await api.post('/joinRoom', { roomId });
      return response.data;
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  },
};

export default api;
