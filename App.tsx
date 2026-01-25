
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, PanelLeft, Play, Square, Minus, Plus, Settings } from 'lucide-react';
import Sidebar, { ViewType } from './components/Sidebar';
import CardDisplay from './components/CardDisplay';
import Controls from './components/Controls';
import { GuideView, SourcesView, HomeView } from './components/InfoViews';
import { DATA, getFirstSubCategory } from './data';
import { PlayState, RepetitionOption, SubCategory } from './types';
import { audioEngine, BackingStyle } from './services/audioEngine';

function App() {
  // --- State ---
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isControlsOpen, setControlsOpen] = useState(true);

  // Navigation State
  const [currentView, setCurrentView] = useState<ViewType>('HOME');
  const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory>(getFirstSubCategory());

  // Asset Path Management
  // Standard Vite/React serving from public folder: use '/cards/'
  const [assetPrefix, setAssetPrefix] = useState<string>(`${import.meta.env.BASE_URL}cards/`);

  // Playback State
  const [playState, setPlayState] = useState<PlayState>(PlayState.STOPPED);
  const [tempo, setTempo] = useState<number>(100);
  const [repetition, setRepetition] = useState<RepetitionOption>(4);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isBackingTrack, setIsBackingTrack] = useState<boolean>(false);

  // Sequencer State
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState<number>(0);
  const [nextPhraseIndex, setNextPhraseIndex] = useState<number>(1);
  const [currentBarCount, setCurrentBarCount] = useState<number>(0);
  const [countInBeat, setCountInBeat] = useState<number>(0);

  const stateRef = useRef({
    currentPhraseIndex,
    nextPhraseIndex,
    currentBarCount,
    countInBeat,
    repetition,
    isShuffle,
    phrasesLength: currentSubCategory.phrases.length,
    playState
  });

  useEffect(() => {
    stateRef.current = {
      currentPhraseIndex,
      nextPhraseIndex,
      currentBarCount,
      countInBeat,
      repetition,
      isShuffle,
      phrasesLength: currentSubCategory.phrases.length,
      playState
    };
  }, [currentPhraseIndex, nextPhraseIndex, currentBarCount, countInBeat, repetition, isShuffle, currentSubCategory, playState]);

  // --- Helpers ---
  const getRandomIndex = (excludeIndex: number, length: number) => {
    if (length <= 1) return 0;
    let newIndex = Math.floor(Math.random() * length);
    while (newIndex === excludeIndex) {
      newIndex = Math.floor(Math.random() * length);
    }
    return newIndex;
  };

  const getNextIndexSequential = (currentIndex: number, length: number) => {
    return (currentIndex + 1) % length;
  };

  const handleBeat = useCallback((beatNumber: number) => {
    let activePlayState = stateRef.current.playState;

    if (activePlayState === PlayState.COUNT_IN) {
      if (beatNumber === 0 && stateRef.current.countInBeat === 4) {
        setPlayState(PlayState.PLAYING);
        setCountInBeat(0);
        activePlayState = PlayState.PLAYING;
      } else {
        setCountInBeat(beatNumber + 1);
        return;
      }
    }

    if (activePlayState === PlayState.PLAYING) {
      if (beatNumber === 0) {
        const { currentBarCount, repetition, phrasesLength, isShuffle, nextPhraseIndex } = stateRef.current;
        const newBarCount = currentBarCount + 1;

        if (newBarCount > repetition) {
          const newCurrentIndex = nextPhraseIndex;
          let newNextIndex;
          if (isShuffle) {
            newNextIndex = getRandomIndex(newCurrentIndex, phrasesLength);
          } else {
            newNextIndex = getNextIndexSequential(newCurrentIndex, phrasesLength);
          }

          setCurrentPhraseIndex(newCurrentIndex);
          setNextPhraseIndex(newNextIndex);
          setCurrentBarCount(1);
        } else {
          setCurrentBarCount(newBarCount);
        }
      }
    }
  }, []);

  // --- Audio Engine Config ---
  useEffect(() => {
    audioEngine.onBeat = handleBeat;
    return () => { audioEngine.onBeat = null; };
  }, [handleBeat]);

  useEffect(() => { audioEngine.setTempo(tempo); }, [tempo]);
  useEffect(() => { audioEngine.setBackingTrack(isBackingTrack); }, [isBackingTrack]);
  useEffect(() => {
    const style: BackingStyle = currentSubCategory.id.startsWith('rf') ? 'rock-funk' : 'swing';
    audioEngine.setStyle(style);
  }, [currentSubCategory]);


  // --- Actions ---
  const togglePlay = () => {
    if (playState === PlayState.STOPPED) {
      setPlayState(PlayState.COUNT_IN);
      setCurrentBarCount(0);
      setCountInBeat(1);

      let next = nextPhraseIndex;
      if (isShuffle) {
        next = getRandomIndex(currentPhraseIndex, currentSubCategory.phrases.length);
      } else {
        next = getNextIndexSequential(currentPhraseIndex, currentSubCategory.phrases.length);
      }
      setNextPhraseIndex(next);

      audioEngine.start();
    } else {
      setPlayState(PlayState.STOPPED);
      setCountInBeat(0);
      setCurrentBarCount(0);
      audioEngine.stop();
    }
  };

  const stopPlayback = () => {
    if (playState !== PlayState.STOPPED) {
      setPlayState(PlayState.STOPPED);
      setCountInBeat(0);
      setCurrentBarCount(0);
      audioEngine.stop();
    }
  };

  const handleSubCategorySelect = (sub: SubCategory) => {
    stopPlayback();
    setCurrentSubCategory(sub);
    setCurrentPhraseIndex(0);
    setNextPhraseIndex(sub.phrases.length > 1 ? 1 : 0);
    setCurrentView('APP');
  };

  const handleViewSelect = (view: ViewType) => {
    if (view !== 'APP') stopPlayback();
    setCurrentView(view);
  };

  const handlePhraseSelect = (index: number) => {
    setCurrentPhraseIndex(index);
    if (isShuffle) {
      setNextPhraseIndex(getRandomIndex(index, currentSubCategory.phrases.length));
    } else {
      setNextPhraseIndex(getNextIndexSequential(index, currentSubCategory.phrases.length));
    }
    setCurrentBarCount(0);
  };

  const handleNextPhrase = useCallback(() => {
    const length = currentSubCategory.phrases.length;
    const nextIndex = (currentPhraseIndex + 1) % length;
    handlePhraseSelect(nextIndex);
  }, [currentPhraseIndex, currentSubCategory, handlePhraseSelect]);

  const handlePrevPhrase = useCallback(() => {
    const length = currentSubCategory.phrases.length;
    const prevIndex = (currentPhraseIndex - 1 + length) % length;
    handlePhraseSelect(prevIndex);
  }, [currentPhraseIndex, currentSubCategory, handlePhraseSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentView !== 'APP') return;

      if (e.key === 'ArrowRight') {
        handleNextPhrase();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhrase();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, handleNextPhrase, handlePrevPhrase]);

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    if (playState === PlayState.STOPPED) {
      if (!isShuffle) {
        setNextPhraseIndex(getRandomIndex(currentPhraseIndex, currentSubCategory.phrases.length));
      } else {
        setNextPhraseIndex(getNextIndexSequential(currentPhraseIndex, currentSubCategory.phrases.length));
      }
    }
  };

  const isPlaying = playState !== PlayState.STOPPED;

  const getHeaderText = () => {
    if (currentView === 'APP') return currentSubCategory.name;
    if (currentView === 'HOME') return 'Welcome to Flash Phrases';
    if (currentView === 'GUIDE') return 'Guide';
    return 'Sources';
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">
      <Sidebar
        currentSubCategory={currentSubCategory}
        onSelectSubCategory={handleSubCategorySelect}
        currentView={currentView}
        onSelectView={handleViewSelect}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col relative w-full h-full min-w-0 transition-all duration-300">

        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 border-b border-gray-800 bg-gray-900 z-10 shrink-0 justify-between">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="ml-2 text-lg font-bold text-indigo-400 truncate max-w-[150px]">
              {getHeaderText()}
            </h1>
          </div>
          {currentView === 'APP' && (
            <button onClick={togglePlay} className={`p-2 rounded-full ${isPlaying ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
              {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
          )}
        </div>

        {!isSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden md:flex absolute top-4 left-4 z-20 bg-gray-800 text-gray-300 p-2 rounded-md hover:text-white hover:bg-gray-700 shadow-lg border border-gray-700"
            title="Open Menu"
          >
            <PanelLeft className="w-6 h-6" />
          </button>
        )}

        {currentView === 'APP' ? (
          <>
            <div className="flex-1 overflow-hidden relative bg-gradient-to-br from-gray-900 to-gray-800">
              <CardDisplay
                currentPhrase={currentSubCategory.phrases[currentPhraseIndex]}
                nextPhrase={currentSubCategory.phrases[nextPhraseIndex]}
                playState={playState}
                countInBeat={countInBeat}
                assetPrefix={assetPrefix}
                onUpdatePrefix={setAssetPrefix}
              />

              {/* Desktop Top-Left Controls */}
              <div className={`absolute top-4 transition-all duration-300 z-10 hidden md:flex gap-3 ${isSidebarOpen ? 'left-4' : 'left-16'}`}>
                <button
                  onClick={togglePlay}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg backdrop-blur-md border transition-all active:scale-95 group ${isPlaying
                    ? 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30 text-red-100'
                    : 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30 text-green-100'
                    }`}
                >
                  <div className={`p-1 rounded-full ${isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </div>
                  <span className="font-bold uppercase tracking-wide text-sm w-12">
                    {isPlaying ? 'Stop' : 'Start'}
                  </span>
                </button>

                <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
                  <button onClick={() => setTempo(Math.max(40, tempo - 5))} className="p-1 text-gray-400 hover:text-white"><Minus className="w-4 h-4" /></button>
                  <div className="text-center w-16">
                    <span className="text-xl font-mono font-black text-indigo-400 leading-none block">{tempo}</span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase">BPM</span>
                  </div>
                  <button onClick={() => setTempo(Math.min(240, tempo + 5))} className="p-1 text-gray-400 hover:text-white"><Plus className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="absolute top-4 right-4 z-10 flex items-stretch gap-4">
                <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-3 rounded-xl shadow-xl text-right min-w-[120px]">
                  <h1 className="text-xl font-bold text-gray-300 tracking-tight opacity-80 uppercase text-xs mb-1">{currentSubCategory.name}</h1>
                  <div className="flex items-baseline justify-end gap-2">
                    <span className="text-sm font-bold text-gray-400 uppercase">Bar</span>
                    <span className="text-4xl font-black text-white tabular-nums tracking-tighter">
                      {playState === PlayState.PLAYING && currentBarCount > 0 ? currentBarCount : 1}
                      <span className="text-gray-500 text-2xl">/</span>
                      <span className="text-gray-400 text-3xl">{repetition}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Controls
              repetition={repetition}
              setRepetition={setRepetition}
              isShuffle={isShuffle}
              toggleShuffle={toggleShuffle}
              currentSubCategory={currentSubCategory}
              currentPhraseIndex={currentPhraseIndex}
              onPhraseSelect={handlePhraseSelect}
              isBackingTrack={isBackingTrack}
              toggleBackingTrack={() => setIsBackingTrack(!isBackingTrack)}
              isOpen={isControlsOpen}
              onToggle={() => setControlsOpen(!isControlsOpen)}
              assetPrefix={assetPrefix}
              onUpdatePrefix={setAssetPrefix}
            />
          </>
        ) : (
          <div className="flex-1 bg-gray-900 overflow-hidden flex flex-col">
            {currentView === 'HOME' && <HomeView />}
            {currentView === 'GUIDE' && <GuideView />}
            {currentView === 'SOURCES' && <SourcesView />}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
