
import React, { useState } from 'react';
import { Shuffle, Repeat, Music2, ChevronDown, ChevronUp, Guitar, Settings, FolderClosed } from 'lucide-react';
import { SubCategory, RepetitionOption } from '../types';

interface ControlsProps {
  repetition: RepetitionOption;
  setRepetition: (val: RepetitionOption) => void;
  isShuffle: boolean;
  toggleShuffle: () => void;
  currentSubCategory: SubCategory;
  currentPhraseIndex: number;
  onPhraseSelect: (index: number) => void;
  isBackingTrack: boolean;
  toggleBackingTrack: () => void;
  isOpen: boolean;
  onToggle: () => void;
  assetPrefix: string;
  onUpdatePrefix: (newPrefix: string) => void;
}

const Controls: React.FC<ControlsProps> = ({
  repetition,
  setRepetition,
  isShuffle,
  toggleShuffle,
  currentSubCategory,
  currentPhraseIndex,
  onPhraseSelect,
  isBackingTrack,
  toggleBackingTrack,
  isOpen,
  onToggle,
  assetPrefix,
  onUpdatePrefix
}) => {

  const [showSettings, setShowSettings] = useState(false);
  const cardBaseClass = "flex flex-col rounded-xl border p-3 shadow-sm relative overflow-hidden transition-all duration-200 h-[100px]";
  const labelClass = "text-[10px] text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1.5 mb-1";

  return (
    <div className="flex-none bg-gray-800 border-t border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] z-20 flex flex-col transition-all duration-300 pb-[env(safe-area-inset-bottom)] mb-4">

      <div className="w-full flex items-center justify-between px-4 p-1 border-b border-gray-700/50">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-1 rounded hover:bg-gray-700 transition-colors ${showSettings ? 'text-indigo-400' : 'text-gray-500'}`}
          title="Asset Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        <div
          onClick={onToggle}
          className="flex-1 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors h-full"
          title={isOpen ? "Hide Controls" : "Show Controls"}
        >
          {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronUp className="w-4 h-4 text-gray-500" />}
        </div>

        <div className="w-4" /> {/* Spacer */}
      </div>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 pt-2">

          {/* Diagnostic Settings Overlay */}
          {showSettings && (
            <div className="mb-4 p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <FolderClosed className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Asset Root Path</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={assetPrefix}
                  onChange={(e) => onUpdatePrefix(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-xs font-mono text-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. public/cards/"
                />
                <button
                  onClick={() => setShowSettings(false)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded transition-colors"
                >
                  Apply
                </button>
              </div>
              <p className="text-[9px] text-gray-500 mt-2">Adjust this if images aren't loading. Example: <code className="text-gray-400">cards/</code> or <code className="text-gray-400">public/cards/</code></p>
            </div>
          )}

          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">

            {/* 1. BACKING TRACK */}
            <div className={`${cardBaseClass} bg-gray-900 border-gray-700 justify-between`}>
              <label className={labelClass}>
                <Guitar className="w-3 h-3" /> Audio
              </label>
              <div className="flex-1 flex flex-col justify-end pb-0.5">
                <button
                  onClick={toggleBackingTrack}
                  className={`w-full py-2 px-3 rounded-md font-bold text-xs flex items-center justify-between transition-all ${isBackingTrack
                    ? 'bg-indigo-900/30 border border-indigo-500/50 text-indigo-300'
                    : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                >
                  <span>{isBackingTrack ? 'Band On' : 'Band Off'}</span>
                  <div className={`w-2.5 h-2.5 rounded-full transition-colors ${isBackingTrack ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]' : 'bg-gray-600'
                    }`} />
                </button>
              </div>
            </div>

            {/* 2. REPEATS */}
            <div className={`${cardBaseClass} bg-gray-900 border-gray-700 justify-between`}>
              <label className={labelClass}>
                <Repeat className="w-3 h-3" /> Repeats
              </label>
              <div className="grid grid-cols-4 gap-1 h-full items-end pb-0.5">
                {[1, 2, 4, 8].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setRepetition(opt as RepetitionOption)}
                    className={`flex flex-col items-center justify-center py-1.5 rounded transition-all ${repetition === opt
                      ? 'bg-indigo-600 text-white font-bold shadow-md ring-1 ring-indigo-400'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700/50'
                      }`}
                  >
                    <span className="text-lg leading-none">{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. MODE */}
            <div className={`${cardBaseClass} bg-gray-900 border-gray-700 justify-between`}>
              <label className={labelClass}>
                <Shuffle className="w-3 h-3" /> Mode
              </label>
              <div className="flex-1 flex flex-col justify-end pb-0.5">
                <button
                  onClick={toggleShuffle}
                  className={`w-full py-2 px-3 rounded-md font-bold text-xs flex items-center justify-between transition-all group ${isShuffle
                    ? 'bg-indigo-900/30 border border-indigo-500/50 text-indigo-300'
                    : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                >
                  <span>{isShuffle ? 'Random' : 'Linear'}</span>
                  <div className={`w-2.5 h-2.5 rounded-full transition-colors ${isShuffle ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]' : 'bg-gray-600'
                    }`} />
                </button>
              </div>
            </div>

            {/* 4. PHRASE SELECTOR */}
            <div className={`${cardBaseClass} bg-gray-900 border-gray-700 justify-between`}>
              <label className={labelClass}>
                <Music2 className="w-3 h-3" /> Phrase
              </label>
              <div className="flex-1 flex flex-col justify-end pb-0.5">
                <div className="relative">
                  <select
                    value={currentPhraseIndex}
                    onChange={(e) => onPhraseSelect(parseInt(e.target.value))}
                    className="bg-gray-800 text-white text-xs font-medium rounded-md border border-gray-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 disabled:opacity-50 disabled:cursor-not-allowed appearance-none truncate pr-6"
                  >
                    {currentSubCategory.phrases.map((p, idx) => (
                      <option key={p.id} value={idx}>
                        {idx + 1}. {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
