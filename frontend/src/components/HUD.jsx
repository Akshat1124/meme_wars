import { useState, useEffect } from 'react';

const HUD = () => {
  const [time, setTime] = useState(new Date());
  const [battleStatus, setBattleStatus] = useState('ACTIVE');
  const [powerLevel, setPowerLevel] = useState(75);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const powerTimer = setInterval(() => {
      setPowerLevel(prev => {
        const newLevel = prev + (Math.random() - 0.5) * 10;
        return Math.max(30, Math.min(100, newLevel));
      });
    }, 2000);
    return () => clearInterval(powerTimer);
  }, []);

  return (
    <>
      {/* HUD Overlay */}
      <div className="hud-overlay">
        {/* Corner brackets */}
        <div className="hud-corner top-left"></div>
        <div className="hud-corner top-right"></div>
        <div className="hud-corner bottom-left"></div>
        <div className="hud-corner bottom-right"></div>
        
        {/* Status bars */}
        <div className="status-bar top"></div>
        <div className="status-bar bottom"></div>
      </div>

      {/* Battle Grid Background */}
      <div className="battle-grid"></div>

      {/* Left Sidebar */}
      <div className="sidebar-left">
        {/* Mini Radar */}
        <div className="mini-radar">
          <div className="absolute top-1 left-1 text-xs text-cyan-400 font-mono">SCAN</div>
        </div>

        {/* Power Indicator */}
        <div className="power-indicator">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-400 via-yellow-400 to-red-400 transition-all duration-500"
            style={{ height: `${powerLevel}%` }}
          ></div>
        </div>

        {/* System Status */}
        <div className="hud-element">
          <div className="text-xs text-cyan-400 font-mono mb-1">SYS STATUS</div>
          <div className="text-xs text-green-400 font-mono">{battleStatus}</div>
          <div className="text-xs text-yellow-400 font-mono mt-1">
            PWR: {Math.round(powerLevel)}%
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="sidebar-right">
        {/* Mission Timer */}
        <div className="hud-element">
          <div className="text-xs text-cyan-400 font-mono mb-1">MISSION TIME</div>
          <div className="text-xs text-white font-mono">
            {time.toLocaleTimeString()}
          </div>
        </div>

        {/* Network Status */}
        <div className="hud-element">
          <div className="text-xs text-cyan-400 font-mono mb-1">NETWORK</div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="text-xs text-green-400 font-mono">ONLINE</div>
          </div>
        </div>

        {/* Battle Coordinates */}
        <div className="hud-element">
          <div className="text-xs text-cyan-400 font-mono mb-1">COORDINATES</div>
          <div className="text-xs text-white font-mono">
            X: {Math.round(Math.random() * 999)}
          </div>
          <div className="text-xs text-white font-mono">
            Y: {Math.round(Math.random() * 999)}
          </div>
        </div>

        {/* Threat Level */}
        <div className="hud-element">
          <div className="text-xs text-cyan-400 font-mono mb-1">THREAT LVL</div>
          <div className="text-xs text-orange-400 font-mono">MODERATE</div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
            <div className="bg-orange-400 h-1 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>

      {/* Top HUD Info Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="hud-element flex items-center space-x-6 px-6 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-mono text-white">BATTLE PROTOCOL ACTIVE</span>
          </div>
          <div className="text-sm font-mono text-cyan-400">
            MEME WARS v2.1.0
          </div>
        </div>
      </div>

      {/* Bottom HUD Command Bar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="hud-element flex items-center space-x-4 px-6 py-2">
          <div className="text-xs font-mono text-gray-400">CMD:</div>
          <div className="text-xs font-mono text-green-400 terminal-text">
            AWAITING_ORDERS...
          </div>
        </div>
      </div>
    </>
  );
};

export default HUD;
