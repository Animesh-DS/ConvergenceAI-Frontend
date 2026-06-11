import React from 'react';

// Helper object to map agent names to their specific Tailwind classes
const themeMap = {
  aria: { bg: 'bg-agent-aria/10', border: 'border-agent-aria', text: 'text-agent-aria', bubble: 'bg-emerald-50 border-emerald-200' },
  rex: { bg: 'bg-agent-rex/10', border: 'border-agent-rex', text: 'text-agent-rex', bubble: 'bg-rose-50 border-rose-200' },
  nova: { bg: 'bg-agent-nova/10', border: 'border-agent-nova', text: 'text-agent-nova', bubble: 'bg-sky-50 border-sky-200' },
  zara: { bg: 'bg-agent-zara/10', border: 'border-agent-zara', text: 'text-agent-zara', bubble: 'bg-amber-50 border-amber-200' },
};

export default function AgentPanel({ agent = 'aria', message, timestamp, targets = [] }) {
  const theme = themeMap[agent] || themeMap.aria;
  
  // Format timestamp nicely
  const timeString = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="flex w-full mb-6">
      {/* Avatar */}
      <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full border-2 ${theme.border} ${theme.bg} ${theme.text} font-bold text-xl uppercase shadow-sm`}>
        {agent.charAt(0)}
      </div>

      {/* Message Content */}
      <div className="ml-4 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-bold capitalize ${theme.text}`}>{agent}</span>
          <span className="text-xs text-gray-400">{timeString}</span>
        </div>

        <div className={`relative px-5 py-4 rounded-2xl rounded-tl-none border shadow-sm max-w-3xl ${theme.bubble}`}>
          {/* Target Badge (Only renders if targets exist) */}
          {targets.length > 0 && (
            <div className="absolute -top-3 left-4 flex gap-1">
              {targets.map((target, idx) => (
                <span key={idx} className="bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Targeting: {target}
                </span>
              ))}
            </div>
          )}
          
          <p className="text-gray-800 leading-relaxed text-[15px]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}