import React from 'react';
import { BookOpen, Info } from 'lucide-react';
import { FlashLogo } from './FlashLogo';

export const HomeView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-4xl mx-auto w-full text-gray-300 flex flex-col justify-center items-center text-center h-full">
      <div className="mb-8">
        <div className="bg-indigo-500/20 p-8 rounded-full inline-block mb-6 shadow-lg shadow-indigo-500/20">
            <FlashLogo className="w-24 h-24 text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Welcome to Flash Phrases</h1>
      </div>
      
      <div className="max-w-2xl bg-gray-800/50 p-8 rounded-2xl border border-gray-700 shadow-xl backdrop-blur-sm">
        <p className="text-lg md:text-xl leading-relaxed text-gray-300 text-left">
          Flash Phrases is a web-app designed as a coordination training tool for drum set players. It features flash card phrase variations, metronome integration, and customizable playback settings. During playback, it will display single-bar flash cards of phrase variations for snare drum and/or bass drum voices. These are intended to be combined with common ostinatos in the other limbs. To get started, use the sidebar menu on the left to select which flash card set you would like to use.
        </p>
      </div>
    </div>
  );
};

export const GuideView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-4xl mx-auto w-full text-gray-300">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-700">
        <Info className="w-8 h-8 text-indigo-500" />
        <h1 className="text-3xl font-bold text-white">Guide</h1>
      </div>

      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <span className="bg-indigo-600 w-2 h-6 rounded-full"></span>
              Navigation
            </h3>
            <p>Use the sidebar to select and load a flash card set in either Rock & Funk or Swing feels.</p>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <span className="bg-indigo-600 w-2 h-6 rounded-full"></span>
              Flash Cards
            </h3>
            <p>In the main view, the left side displays the current phrase to be performed. The right side displays a preview of the next phrase to be performed.</p>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
             <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <span className="bg-indigo-600 w-2 h-6 rounded-full"></span>
              Start and Stop
            </h3>
            <p>When you press start, a 4‑beat count‑in occurs before the phrase on the left is to be performed. Use the stop button to turn off the metronome and to prevent the phrases from proceeding.</p>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
             <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <span className="bg-indigo-600 w-2 h-6 rounded-full"></span>
              Tempo
            </h3>
            <p>Adjust the tempo to your preferences using the text input or slider.</p>
          </section>

           <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
             <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <span className="bg-indigo-600 w-2 h-6 rounded-full"></span>
              Phrase Repetition
            </h3>
            <p>Single bar phrases can be repeated 1x, 2x, 4x, or 8x before the next phrase slides to the left.</p>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
             <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <span className="bg-indigo-600 w-2 h-6 rounded-full"></span>
              Mode
            </h3>
            <p>Use the MODE selector to switch between <strong>Linear</strong>, where the phrases move sequentially and <strong>Random</strong>, where the phrases will move in a random order.</p>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 md:col-span-2">
             <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <span className="bg-indigo-600 w-2 h-6 rounded-full"></span>
              Phrase Selector
            </h3>
            <p>Use the phrase selector menu to pick a specific phrase number to begin on.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const SourcesView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-3xl mx-auto w-full text-gray-300">
       <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-700">
        <BookOpen className="w-8 h-8 text-indigo-500" />
        <h1 className="text-3xl font-bold text-white">Sources</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg border-l-4 border-indigo-500">
          <h2 className="text-xl font-bold text-white mb-2">Rock & Funk</h2>
          <p className="text-gray-400 mb-4 text-sm uppercase tracking-wider">Phrase Variations</p>
          <p className="text-lg">
             Can be found in: <span className="font-bold text-white italic">It's About Time</span> by Fred Dinkins
          </p>
        </div>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg border-l-4 border-pink-500">
          <h2 className="text-xl font-bold text-white mb-2">Swing</h2>
          <p className="text-gray-400 mb-4 text-sm uppercase tracking-wider">Phrase Variations</p>
          <p className="text-lg">
             Can be found in: <span className="font-bold text-white italic">Studio/Jazz Drum Cookbook</span> by John Pickering
          </p>
        </div>
      </div>
    </div>
  );
};