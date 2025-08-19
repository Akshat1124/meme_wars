import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { Home, Swords, Trophy, Info, Copy, Check, Github } from 'lucide-react';

// Import the new components
import RoomForm from './components/RoomForm';
import MemeUploader from './components/MemeUploader';
import VoteScreen from './components/VoteScreen';
import ResultScreen from './components/ResultScreen';
import { api } from './api'; // Import from the new api.js

/***************************\
|* LAYOUT & SHELL     *|
\***************************/
function Shell({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans bg-grid-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-gray-900/80 to-black/80"></div>
      <header className="sticky top-0 z-20 bg-black/30 backdrop-blur-lg border-b border-purple-500/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 text-2xl font-black tracking-tighter text-white">
            <Swords className="text-purple-400" />
            MemeBattle
          </Link>
          <div className="flex items-center gap-4 text-sm">
             <a href="https://github.com/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
              <Github size={16} /> Docs
            </a>
          </div>
        </div>
      </header>
      <main className="relative max-w-6xl mx-auto px-4 py-8 md:py-12">{children}</main>
      <footer className="relative max-w-6xl mx-auto px-4 py-10 text-center text-sm text-gray-500">
        Built with 🔥 for the ultimate Meme Lords
      </footer>
    </div>
  );
}

/***************************\
|* PAGES            *|
\***************************/
function SectionCard({ title, icon, children }) {
  const Icon = icon;
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 border-2 border-purple-500/30 rounded-2xl p-6 md:p-8 shadow-2xl shadow-purple-900/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        {Icon && <Icon className="w-8 h-8 text-purple-400" />}
        <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
      </div>
      <div>{children}</div>
    </motion.section>
  );
}

function HomePage() {
  return (
    <div className="grid gap-12">
      <Hero />
      <SectionCard title="Start a New Game" icon={Swords}>
        <RoomForm />
      </SectionCard>
      <HowItWorks />
    </div>
  );
}

function RoomPage() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = async () => {
    try {
      setLoading(true);
      const r = await api.getRoom(id);
      setRoom(r);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 2000);
    return () => clearInterval(t);
  }, [id]);

  const bothUploaded = room?.memes?.length >= 2;

  return (
    <SectionCard title={`Battle Room: ${id}`} icon={Home}>
      {loading && !room && <p className="text-center text-gray-400">Loading room...</p>}
      {error && <div className="p-3 rounded-lg bg-red-900/50 text-red-300 border border-red-500/50">{error}</div>}
      {room && (
        <div className="grid md:grid-cols-2 gap-8">
          <MemeUploader roomId={id} slot="Player 1" onChange={refresh} existing={room.memes?.find(m => m.playerName === "Player 1" || !room.memes.find(m2 => m2.playerName === "Player 1"))} />
          <MemeUploader roomId={id} slot="Player 2" onChange={refresh} existing={room.memes?.find(m => m.playerName === "Player 2")} />
        </div>
      )}
      <div className="mt-8 p-4 bg-gray-900/60 rounded-lg border border-gray-700 flex flex-wrap items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bothUploaded ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
          {room?.memes?.length || 0} / 2 Memes Uploaded
        </span>
        <CopyLinkButton label="Copy Voting Link" path={`/vote/${id}`} disabled={!bothUploaded} />
        <CopyLinkButton label="Copy Results Link" path={`/result/${id}`} />
      </div>
    </SectionCard>
  );
}

function VotePage() {
  const { roomId } = useParams();
  return (
    <SectionCard title={`Vote Now!`} icon={Trophy}>
      <p className="text-gray-400 mb-6 -mt-2">The fate of the memes is in your hands. Choose wisely.</p>
      <VoteScreen roomId={roomId} />
    </SectionCard>
  );
}

function ResultPage() {
  const { roomId } = useParams();
  return (
    <SectionCard title="Battle Results" icon={Trophy}>
       <p className="text-gray-400 mb-6 -mt-2">The people have spoken! Here are the results.</p>
      <ResultScreen roomId={roomId} />
    </SectionCard>
  );
}

/***************************\
|* COMPONENTS        *|
\***************************/

function CopyLinkButton({ label, path, disabled }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}${path}`;
  return (
    <button
      disabled={disabled}
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-lg shadow-lg shadow-purple-600/50 border-2 border-purple-500 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "Copied!" : label}
    </button>
  );
}

function Hero() {
  const nav = useNavigate();
  return (
    <div className="text-center py-16">
      <motion.h1 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white"
      >
        The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Meme Battle</span> Arena
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-4 max-w-2xl mx-auto text-lg text-gray-400"
      >
        Two players enter, one meme reigns supreme. Settle the score, prove your meme mastery, and claim eternal glory.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 flex justify-center gap-4"
      >
        <a href="#join" className="px-8 py-4 font-bold text-white bg-pink-600 rounded-lg shadow-lg shadow-pink-600/50 border-2 border-pink-500 transition-all duration-200 hover:scale-105">
          Get Started
        </a>
      </motion.div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { t: "Create/Join", d: "Start a room or join a friend's battle." },
    { t: "Upload Meme", d: "Choose your weapon: the dankest meme you have." },
    { t: "Share Link", d: "Send the voting link to your audience." },
    { t: "Cast Votes", d: "Everyone gets one vote to pick the winner." },
    { t: "Crown Winner", d: "The meme with the most votes is crowned champion." },
  ];
  return (
    <SectionCard title="How It Works" icon={Info}>
      <div className="grid md:grid-cols-5 gap-6">
        {steps.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i }}
            className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
          >
            <div className="text-xs text-purple-400 font-bold">STEP {i + 1}</div>
            <div className="font-semibold text-white mt-1">{s.t}</div>
            <div className="text-sm text-gray-400 mt-1">{s.d}</div>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

/***************************\
|* APP             *|
\***************************/
function AppRouter() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/room/:id" element={<RoomPage />} />
          <Route path="/vote/:roomId" element={<VotePage />} />
          <Route path="/result/:roomId" element={<ResultPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <SectionCard title="404 – Page Not Found">
      <p className="text-gray-400">Looks like you've entered a broken link. The meme you're looking for is in another castle.</p>
      <Link className="underline text-purple-400 mt-4 inline-block" to="/home">Return to Home Base</Link>
    </SectionCard>
  );
}

export default AppRouter;
