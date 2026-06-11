import React from 'react';

// Helper for agent specific text colors
const textColors = {
  aria: 'text-emerald-600',
  rex: 'text-rose-600',
  nova: 'text-sky-600',
  zara: 'text-amber-600'
};

export default function VerdictCard({ verdict, confidence, summary_by_agent = {} }) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mt-8">
      {/* Header Section */}
      <div className="bg-gray-900 p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-rose-500"></div>
        <h2 className="text-gray-400 uppercase tracking-widest text-sm font-bold mb-4">Final Consensus Verdict</h2>
        <p className="text-2xl md:text-3xl text-white font-medium leading-relaxed max-w-3xl mx-auto">
          "{verdict}"
        </p>
      </div>

      <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center border-b border-gray-100">
        {/* Confidence Score Display */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-8 border-gray-50 shadow-inner bg-white">
            <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)]"></div>
            <span className="text-5xl font-black text-gray-800">{confidence}</span>
            <span className="text-lg text-gray-400 font-bold ml-1">%</span>
          </div>
          <span className="mt-3 text-sm font-bold text-gray-500 uppercase tracking-wider">Confidence</span>
        </div>

        {/* 2x2 Grid for Agent Summaries */}
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(summary_by_agent).map(([agentName, summary]) => (
            <div key={agentName} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className={`text-sm font-black uppercase tracking-wider mb-2 ${textColors[agentName] || 'text-gray-700'}`}>
                {agentName}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}