import React from 'react';
import { Home, Award, Crown, Globe, Settings } from 'lucide-react';
import { sound } from '../utils/audio';

export type TabType = 'home' | 'career' | 'legacy' | 'world' | 'more';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'career', label: 'Career', icon: <Award className="w-5 h-5" /> },
    { id: 'legacy', label: 'Legacy', icon: <Crown className="w-5 h-5" /> },
    { id: 'world', label: 'World', icon: <Globe className="w-5 h-5" /> },
    { id: 'more', label: 'More', icon: <Settings className="w-5 h-5" /> }
  ];

  const handleTabClick = (tabId: TabType) => {
    sound.playTap();
    setActiveTab(tabId);
  };

  return (
    <nav className="h-16 bg-[#2A2A2A] border-t border-white/10 flex items-center justify-around z-20 px-2">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive ? 'text-[#2ECC71] font-bold' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <div className={`transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}>
              {tab.icon}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
