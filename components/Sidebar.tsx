import React from 'react';
import { DATA } from '../data';
import { SubCategory } from '../types';
import { ListMusic, X, ChevronLeft, Info, BookOpen, Home } from 'lucide-react';
import { FlashLogo } from './FlashLogo';

export type ViewType = 'APP' | 'HOME' | 'GUIDE' | 'SOURCES';

interface SidebarProps {
  currentSubCategory: SubCategory;
  onSelectSubCategory: (sub: SubCategory) => void;
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentSubCategory, 
  onSelectSubCategory, 
  currentView,
  onSelectView,
  isOpen, 
  onClose 
}) => {

  const handleLinkClick = (action: () => void) => {
    action();
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <aside 
        className={`
          fixed md:relative top-0 left-0 h-full bg-gray-900 border-r border-gray-800 z-30 
          transform transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 md:overflow-hidden'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800 min-w-[16rem]">
          <div 
            className="flex items-center gap-3 font-bold text-xl text-indigo-400 cursor-pointer group"
            onClick={() => handleLinkClick(() => onSelectView('HOME'))}
          >
            <FlashLogo className="w-8 h-8 group-hover:text-indigo-300 transition-colors" />
            <span className="group-hover:text-indigo-300 transition-colors">Flash Phrases</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
             {/* Show X on mobile, ChevronLeft on desktop */}
            <X className="w-6 h-6 md:hidden" />
            <ChevronLeft className="w-6 h-6 hidden md:block" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 min-w-[16rem]">
          
          {/* Information Section */}
          <div className="mb-6 border-b border-gray-800 pb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Information
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleLinkClick(() => onSelectView('HOME'))}
                  className={`w-full flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentView === 'HOME'
                      ? 'bg-gray-800 text-white border border-gray-700'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick(() => onSelectView('GUIDE'))}
                  className={`w-full flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentView === 'GUIDE'
                      ? 'bg-gray-800 text-white border border-gray-700'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Info className="w-4 h-4" />
                  <span>Guide</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick(() => onSelectView('SOURCES'))}
                  className={`w-full flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentView === 'SOURCES'
                      ? 'bg-gray-800 text-white border border-gray-700'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Sources</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Flash Cards Categories */}
          {DATA.map((category) => (
            <div key={category.id} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                {category.name}
              </h3>
              <ul className="space-y-1">
                {category.subCategories.map((sub) => {
                  const isActive = currentView === 'APP' && currentSubCategory.id === sub.id;
                  return (
                    <li key={sub.id}>
                      <button
                        onClick={() => handleLinkClick(() => {
                          onSelectSubCategory(sub);
                        })}
                        className={`w-full flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <ListMusic className="w-4 h-4" />
                        <span className="text-left">{sub.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 text-[10px] text-gray-500 text-center min-w-[16rem]">
          <p className="mb-1">
            Created by <a href="https://thadanderson.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors">Thad Anderson</a>
          </p>
          <p>Copyright © 2025</p>
          <p>All Rights Reserved</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;