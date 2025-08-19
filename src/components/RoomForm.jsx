import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, Swords } from 'lucide-react';

// Utility functions (assuming they are in a separate utils file or defined in AppRouter)
function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function saveLS(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
function getLS(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

const NeonButton = ({ children, onClick, className = '' }) => (
  <motion.button
    whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgb(255,255,255)", boxShadow: "0px 0px 12px rgb(192, 132, 252)" }}
    whileTap={{ scale: 0.95 }}
    className={`px-6 py-3 font-bold text-white bg-purple-600 rounded-lg shadow-lg shadow-purple-600/50 border-2 border-purple-500 transition-all duration-200 ${className}`}
    onClick={onClick}
  >
    {children}
  </motion.button>
);

const InputField = React.forwardRef(({ placeholder, value, onChange }, ref) => (
  <input
    ref={ref}
    className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
));

export default function RoomForm() {
  const nav = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState(getLS("mb_player_name", ""));
  const [err, setErr] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (window.location.hash === "#join" && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const createRoom = () => {
    const id = uid("room");
    if (!name.trim()) return setErr("Enter your display name first!");
    saveLS("mb_player_name", name.trim());
    nav(`/room/${id}`);
  };

  const joinRoom = () => {
    setErr("");
    if (!roomId.trim()) return setErr("Please enter a Room ID.");
    if (!name.trim()) return setErr("Please enter your display name.");
    saveLS("mb_player_name", name.trim());
    nav(`/room/${roomId.trim()}`);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8" id="join">
      {/* Create Room Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900/50 border-2 border-purple-500/50 rounded-2xl p-6 shadow-2xl shadow-purple-900/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <Swords className="w-8 h-8 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">Create New Battle</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">Start a new meme battle room and invite your friend.</p>
        <InputField
            placeholder="Your epic gamer name"
            value={name}
            onChange={e => setName(e.target.value)}
        />
        <NeonButton onClick={createRoom} className="w-full mt-4">
          <span className="flex items-center justify-center gap-2">
            <Swords size={20} /> Create Room
          </span>
        </NeonButton>
      </motion.div>

      {/* Join Room Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900/50 border-2 border-pink-500/50 rounded-2xl p-6 shadow-2xl shadow-pink-900/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <Gamepad2 className="w-8 h-8 text-pink-400" />
          <h3 className="text-2xl font-bold text-white">Join a Battle</h3>
        </div>
        <div className="grid gap-4">
          <InputField
            ref={inputRef}
            placeholder="Enter Room ID"
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
          />
          <InputField
            placeholder="Your epic gamer name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {err && <div className="p-3 rounded-lg bg-red-900/50 text-red-300 border border-red-500/50 text-sm">{err}</div>}
          <NeonButton onClick={joinRoom} className="w-full bg-pink-600 shadow-pink-600/50 border-pink-500">
            <span className="flex items-center justify-center gap-2">
              <Gamepad2 size={20} /> Join Room
            </span>
          </NeonButton>
        </div>
      </motion.div>
    </div>
  );
}
