import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal, Crown, Loader2, XCircle, Share2, ClipboardCheck } from 'lucide-react';
import { api } from '../api'; // Assuming api.js

const LeaderboardIcon = ({ rank }) => {
  if (rank === 0) return <Crown className="w-6 h-6 text-yellow-400" />;
  if (rank === 1) return <Medal className="w-6 h-6 text-slate-300" />;
  if (rank === 2) return <Award className="w-6 h-6 text-amber-600" />;
  return <div className="w-6 text-center font-mono text-gray-400">{rank + 1}</div>;
};

const WinnerCard = ({ meme, isWinner }) => {
  const totalVotes = meme.totalVotesInRoom || 1;
  const votePercentage = totalVotes > 0 ? Math.round((meme.votes / totalVotes) * 100) : 0;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: isWinner ? 0.2 : 0.4 }}
      className={`relative rounded-2xl overflow-hidden bg-gray-900/50 border-2 ${isWinner ? 'border-yellow-400 shadow-2xl shadow-yellow-500/30' : 'border-gray-700'}`}
    >
      {isWinner && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute top-4 right-4 z-10 p-3 bg-yellow-400/20 rounded-full"
        >
          <Trophy className="w-8 h-8 text-yellow-300" />
        </motion.div>
      )}
      <div className="bg-black flex items-center justify-center">
        <img src={meme.imageUrl} alt={meme.playerName} className="w-full object-contain max-h-[50vh]" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-bold text-xl text-white">{meme.playerName}</div>
            <div className="text-sm text-gray-400">{meme.votes} Votes</div>
          </div>
          {isWinner && <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-bold">WINNER</span>}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 mt-3">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full text-right pr-2 text-xs text-white font-bold flex items-center justify-end"
            initial={{ width: 0 }}
            animate={{ width: `${votePercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
           {votePercentage > 10 && `${votePercentage}%`}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ResultScreen() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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

  const winnerData = useMemo(() => {
    if (!room?.memes || room.memes.length < 2) return null;
    const sortedMemes = [...room.memes].sort((a, b) => b.votes - a.votes);
    if (sortedMemes[0].votes === sortedMemes[1].votes) return { tie: true, memes: sortedMemes };
    return { winner: sortedMemes[0], loser: sortedMemes[1], sorted: sortedMemes };
  }, [room]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && !room) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 text-purple-400 animate-spin" /></div>;
  }

  if (error) {
    return <div className="p-4 rounded-lg bg-red-900/50 text-red-300 border border-red-500/50 flex items-center gap-2"><XCircle/> {error}</div>;
  }

  return (
    <div className="space-y-8">
      {winnerData?.tie ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8 bg-gray-800/50 rounded-2xl border-2 border-purple-500/50">
          <h2 className="text-4xl font-extrabold text-purple-400">It's a TIE!</h2>
          <p className="text-gray-300 mt-2">Both players are legends!</p>
        </motion.div>
      ) : winnerData ? (
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <WinnerCard meme={winnerData.winner} isWinner={true} />
          <WinnerCard meme={winnerData.loser} isWinner={false} />
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">Waiting for memes to be uploaded...</div>
      )}

      {winnerData?.sorted && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gray-900/50 border-2 border-gray-700 rounded-2xl shadow-2xl backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white p-4 border-b border-gray-700">Leaderboard</h3>
          <div className="divide-y divide-gray-800">
            {winnerData.sorted.map((m, i) => (
              <div key={m.id} className="p-4 flex items-center gap-4 hover:bg-gray-800/50 transition-colors">
                <LeaderboardIcon rank={i} />
                <div className="flex-1 font-semibold text-white">{m.playerName}</div>
                <div className="text-sm text-gray-400">{m.votes} votes</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      
      <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
        <button
          onClick={copyLink}
          className="flex items-center gap-2 px-6 py-3 font-bold text-white bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-gray-600 transition-all"
        >
          {copied ? <ClipboardCheck size={20} /> : <Share2 size={20} />}
          {copied ? 'Link Copied!' : 'Share Results'}
        </button>
        <Link to={`/vote/${roomId}`} className="underline text-purple-400 hover:text-purple-300">Back to Voting</Link>
        <Link to={`/home`} className="underline text-pink-400 hover:text-pink-300">New Game</Link>
      </div>
    </div>
  );
}
