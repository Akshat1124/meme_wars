import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle, XCircle, User, Image as ImageIcon } from 'lucide-react';

// Mock API and saveLS/getLS should be imported or passed as props
// For simplicity, assuming api object is available globally or via context.
// In a real app, you'd import it.
import { api, saveLS, getLS } from '../api'; // Assuming you create an api.js

const NeonButton = ({ children, onClick, className = '', disabled = false }) => (
  <motion.button
    whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgb(255,255,255)", boxShadow: "0px 0px 12px rgb(34, 197, 94)" }}
    whileTap={{ scale: 0.95 }}
    className={`px-6 py-3 font-bold text-white bg-green-600 rounded-lg shadow-lg shadow-green-600/50 border-2 border-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </motion.button>
);

export default function MemeUploader({ roomId, slot = "Player", onChange, existing }) {
  // FIX: Initialize state locally. Don't rely on localStorage for the input's value.
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info"); // 'info', 'success', 'error'

  // FIX: Set the initial name only once when the component loads.
  // This makes the two components independent of each other.
  useEffect(() => {
    if (existing?.playerName) {
      setName(existing.playerName);
    } else if (slot === 'Player 1') { // Only Player 1 gets the globally saved name
      setName(getLS("mb_player_name", ""));
    }
    // We leave Player 2's name blank by default if no meme is uploaded
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.playerName]); // Run only when `existing` prop changes

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const submit = async () => {
    try {
      setMsg("");
      if (!name.trim()) {
        setMsg("Please enter your display name");
        setMsgType("error");
        return;
      }
      if (!file) {
        setMsg("Please choose an image (PNG/JPG/WebP)");
        setMsgType("error");
        return;
      }
      setBusy(true);
      // Save the name for future sessions, but it won't affect the other input now.
      saveLS("mb_player_name", name.trim());
      await api.upload({ roomId, playerName: name.trim(), file });
      setFile(null);
      setMsg("Upload successful!");
      setMsgType("success");
      onChange?.();
    } catch (e) {
      setMsg(e.message);
      setMsgType("error");
    } finally {
      setBusy(false);
    }
  };

  const Message = () => {
    if (!msg) return null;
    const colors = {
      info: 'text-blue-300',
      success: 'text-green-400',
      error: 'text-red-400',
    };
    const Icon = {
      success: CheckCircle,
      error: XCircle,
    }[msgType] || null;

    return (
      <div className={`flex items-center gap-2 text-sm ${colors[msgType]}`}>
        {Icon && <Icon size={16} />}
        <span>{msg}</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900/50 border-2 border-blue-500/50 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl shadow-blue-900/50 backdrop-blur-sm"
    >
      <div className="text-lg font-bold text-blue-300">{slot}</div>
      <div className="grid gap-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            placeholder="Your display name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {existing?.imageUrl && !preview ? (
          <div className="rounded-xl overflow-hidden border-2 border-gray-700">
            <img src={existing.imageUrl} alt={existing.playerName} className="w-full object-contain max-h-[30vh] bg-black" />
            <div className="p-2 text-xs text-gray-400 flex items-center justify-between bg-gray-800">
              <span>Uploaded by {existing.playerName}</span>
              <span>Votes: {existing.votes}</span>
            </div>
          </div>
        ) : (
          <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-all">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {preview ? (
              <img src={preview} alt="Meme preview" className="max-h-48 mx-auto rounded-md" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <ImageIcon size={40} />
                <span className="text-sm">Drag & drop or click to select a meme</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <NeonButton
            disabled={busy || !file}
            onClick={submit}
            className="w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              <UploadCloud size={20} />
              {busy ? "Uploading..." : existing ? "Re-upload Meme" : "Upload Meme"}
            </span>
          </NeonButton>
          <Message />
        </div>
      </div>
    </motion.div>
  );
}
