import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, Check, XCircle, Loader2 } from 'lucide-react';
import { api, getLS, saveLS, uid } from '../api'; // Assuming api.js

const NeonButton = ({ children, onClick, className = '', disabled = false }) => (
  <motion.button
    whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgb(255,255,255)", boxShadow: "0px 0px 12px rgb(236, 72, 153)" }}
    whileTap={{ scale: 0.95 }}
    className={`w-full px-6 py-4 font-bold text-white bg-pink-600 rounded-lg shadow-lg shadow-pink-600/50 border-2 border-pink-500 transition-all duration-200 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </motion.button>
);

const MemeCard = ({ meme, onVote, disabled, isVotedFor, hasVoted }) => {
  const totalVotes = meme.totalVotesInRoom || 1; // Avoid division by zero
  const votePercentage = totalVotes > 0 ? (meme.votes / totalVotes) * 100 : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-900/50 border-2 border-gray-700 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col"
    >
      <div className="flex-grow bg-black flex items-center justify-center">
        <img src={meme.imageUrl} alt={meme.playerName} className="w-full object-contain max-h-[55vh]" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-lg text-white">{meme.playerName}</div>
          <div className="text-sm text-gray-400">{meme.votes} Votes</div>
        </div>

        {/* Progress Bar */}
        {hasVoted && (
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <motion.div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${votePercentage}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>
        )}

        <NeonButton onClick={() => onVote(meme.id)} disabled={disabled}>
          <span className="flex items-center justify-center gap-2">
            {isVotedFor ? <Check size={20} /> : <ThumbsUp size={20} />}
            {isVotedFor ? "Your Vote" : hasVoted ? "Vote Locked" : "Vote for this Meme"}
          </span>
        </NeonButton>
      </div>
    </motion.div>
  );
};

export default function VoteScreen() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const voterId = useMemo(() => getLS("mb_voter_id") || (() => {
    const id = uid("voter");
    saveLS("mb_voter_id", id);
    return id;
  })(), []);

  const votedKey = `${roomId}:${voterId}`;
  const votesDb = getLS("mb_votes", {});
  const alreadyVotedMemeId = votesDb[votedKey];

  const refresh = async () => {
    try {
      setLoading(true);
      const r = await api.getRoom(roomId);
      const totalVotesInRoom = r.memes.reduce((sum, meme) => sum + meme.votes, 0);
      r.memes = r.memes.map(m => ({ ...m, totalVotesInRoom }));
      setRoom(r);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 2000);
    return () => clearInterval(timer);
  }, [roomId]);

  const castVote = async (memeId) => {
    try {
      setActionError("");
      await api.vote({ roomId, memeId, voterId });
      // Manually update local storage to give instant feedback
      const currentVotes = getLS("mb_votes", {});
      currentVotes[`${roomId}:${voterId}`] = memeId;
      saveLS("mb_votes", currentVotes);
      await refresh();
    } catch (e) {
      setActionError(e.message);
    }
  };

  if (loading && !room) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 text-purple-400 animate-spin" /></div>;
  }

  if (error) {
    return <div className="p-4 rounded-lg bg-red-900/50 text-red-300 border border-red-500/50 flex items-center gap-2"><XCircle/> {error}</div>;
  }

  const ready = room?.memes?.length >= 2;

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {ready ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-8 items-start"
          >
            {room.memes.map(m => (
              <MemeCard
                key={m.id}
                meme={m}
                onVote={castVote}
                disabled={!!alreadyVotedMemeId}
                isVotedFor={alreadyVotedMemeId === m.id}
                hasVoted={!!alreadyVotedMemeId}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10 text-gray-400">Waiting for both memes to be uploaded...</div>
        )}
      </AnimatePresence>

      {actionError && <div className="p-4 rounded-lg bg-red-900/50 text-red-300 border border-red-500/50 flex items-center gap-2"><XCircle/> {actionError}</div>}

      <div className="mt-8 text-center">
        <Link
          to={`/result/${roomId}`}
          className="inline-block px-8 py-3 font-bold text-white bg-purple-600 rounded-lg shadow-lg shadow-purple-600/50 border-2 border-purple-500 transition-all duration-200 hover:scale-105"
        >
          View Live Results
        </Link>
      </div>
    </div>
  );
}
