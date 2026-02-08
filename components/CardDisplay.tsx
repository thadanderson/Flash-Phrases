
import React, { useState, useEffect } from 'react';
import { Phrase, PlayState } from '../types';
import { ImageOff, AlertCircle } from 'lucide-react';

interface CardDisplayProps {
  currentPhrase: Phrase;
  nextPhrase: Phrase;
  playState: PlayState;
  countInBeat: number;
  assetPrefix: string;
  onUpdatePrefix: (newPrefix: string) => void;
}

const CardDisplay: React.FC<CardDisplayProps> = ({
  currentPhrase,
  nextPhrase,
  playState,
  countInBeat,
  assetPrefix,
  onUpdatePrefix
}) => {
  const isCountIn = playState === PlayState.COUNT_IN;

  const [currentImageError, setCurrentImageError] = useState(false);
  const [nextImageError, setNextImageError] = useState(false);

  // Compute URLs
  // The assetPrefix is set to '/cards/' in App.tsx. 
  // currentPhrase.imageUrl is just the filename (e.g. "rockbass1.jpeg")
  // Result: /cards/rockbass1.jpeg
  const currentUrl = `${assetPrefix}${currentPhrase.imageUrl}`;
  const nextUrl = `${assetPrefix}${nextPhrase.imageUrl}`;

  useEffect(() => {
    setCurrentImageError(false);
  }, [currentUrl]);

  useEffect(() => {
    setNextImageError(false);
  }, [nextUrl]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    console.error(`[CardDisplay] Failed to load image. Path attempted: ${target.src}`);
    setCurrentImageError(true);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 p-[2%] w-full h-full overflow-hidden">

      {/* Current Card */}
      <div className="relative w-full md:flex-1 h-full bg-gray-800 rounded-xl shadow-2xl border-2 border-indigo-500 overflow-hidden flex flex-col transition-all duration-300 ease-in-out">
        <div className="absolute top-0 left-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10">
          Current
        </div>

        {isCountIn && (
          <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center backdrop-blur-sm">
            <div className="text-9xl font-bold text-indigo-400 animate-pulse">
              {countInBeat}
            </div>
            <div className="absolute bottom-10 text-xl text-gray-300 uppercase tracking-widest">
              Count In
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center bg-gray-800 relative">
          {!currentImageError ? (
            <img
              src={currentUrl}
              alt={currentPhrase.name}
              className="w-full h-full object-contain"
              onError={handleImageError}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 gap-4 p-6 text-center max-w-xl">
              <div className="relative">
                <ImageOff className="w-12 h-12 text-red-400 opacity-50" />
                <AlertCircle className="w-5 h-5 text-red-500 absolute -top-1 -right-1 animate-bounce" />
              </div>

              <div className="bg-black/50 p-4 rounded-lg border border-red-500/20">
                <h3 className="text-lg font-bold text-white mb-1">Image Not Found</h3>
                <p className="text-xs text-red-300 mb-2 font-mono break-all">
                  Attempted URL: {currentUrl}
                </p>
                <p className="text-[10px] text-gray-400">
                  Check the browser console (F12) for the exact error path.
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-900 p-3 text-center border-t border-gray-700">
          <h2 className="text-lg font-semibold text-white tracking-wide">{currentPhrase.name}</h2>
        </div>
      </div>

      {/* Next Card */}
      <div className="relative w-full md:w-1/3 aspect-video bg-gray-800 rounded-lg shadow-lg border border-gray-700 opacity-60 overflow-hidden flex flex-col max-h-full transition-all duration-300 ease-in-out">
        <div className="absolute top-0 left-0 bg-gray-700 text-gray-300 text-xs font-bold px-3 py-1 rounded-br-lg z-10">
          Next
        </div>

        <div className="flex-1 flex items-center justify-center">
          {!nextImageError ? (
            <img
              src={nextUrl}
              alt={nextPhrase.name}
              className="w-full h-full object-contain grayscale"
              onError={() => setNextImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 gap-1">
              <ImageOff className="w-8 h-8 opacity-30" />
              <p className="text-[10px] font-mono opacity-50">Missing</p>
            </div>
          )}
        </div>
        <div className="bg-gray-900 p-2 text-center border-t border-gray-800">
          <h2 className="text-sm font-medium text-gray-400">{nextPhrase.name}</h2>
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
