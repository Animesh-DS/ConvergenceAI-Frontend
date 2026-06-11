import React, { useCallback, useState } from 'react';

export default function FileDropzone({ onFileUpload }) {
  const [isDragging, setIsDragging] = useState(false);

  // Handle Drag Events
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Handle File Drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileUpload(file);
  }, [onFileUpload]);

  // Handle Browse Click
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) onFileUpload(file);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8">
      
      {/* Hero Headline */}
      <div className="mb-12 text-center animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 mb-4 tracking-tight">
          Initialize AI Debate
        </h1>
        <p className="text-gray-500 font-medium text-lg">
          Upload your problem specification to begin the multi-agent analysis.
        </p>
      </div>

      {/* Interactive Dropzone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full max-w-2xl h-72 border-2 border-dashed rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-300 group
          ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-gray-300 hover:border-blue-400 hover:bg-white'}
        `}
      >
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          onChange={handleFileSelect} 
          accept=".txt,.pdf,.json" // Add or remove file types based on Animesh's parser
        />
        
        <label 
          htmlFor="file-upload" 
          className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
        >
          <svg 
            className={`w-16 h-16 mb-6 transition-all duration-300 
              ${isDragging ? 'text-blue-500 scale-110 -translate-y-2' : 'text-gray-300 group-hover:text-blue-500 group-hover:scale-110 group-hover:-translate-y-2'}
            `}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 20 16"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="mb-2 text-2xl font-bold text-gray-700">
            {isDragging ? "Drop it!" : "Drop Case File Here"}
          </p>
          <p className="text-sm text-gray-400 font-medium">
            or click to browse your computer
          </p>
        </label>
      </div>
    </div>
  );
}