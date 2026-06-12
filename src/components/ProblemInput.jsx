import React, { useState } from 'react';

export default function ProblemInput({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8">
      {/* Hero Headline */}
      <div className="mb-10 text-center animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 mb-4 tracking-tight">
          Initialize AI Debate
        </h1>
        <p className="text-gray-500 font-medium text-lg">
          Describe your problem or dilemma for the agents to analyze.
        </p>
      </div>

      {/* Text Area Form */}
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 p-2 transition-all focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-400"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., Should humanity prioritize settling Mars or fixing climate change on Earth first?"
          className="w-full h-40 p-6 text-lg text-gray-700 bg-transparent resize-none focus:outline-none custom-scrollbar"
          required
        />
        
        <div className="flex justify-end p-2 border-t border-gray-50">
          <button 
            type="submit"
            disabled={!text.trim()}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-md hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            Start Analysis
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}