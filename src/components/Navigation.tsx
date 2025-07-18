
import React from 'react';
import { Home, Search, MapPin, Calendar, ShoppingBag, AlertTriangle, MessageCircle } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'lost-found', label: 'Lost & Found', icon: AlertTriangle },
    { id: 'map', label: 'Campus Map', icon: MapPin },
    { id: 'resources', label: 'Resources', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  ];

  return (
    <nav className="bg-white border-r border-gray-200 h-full w-64 fixed left-0 top-0 z-10 hidden lg:block">
      <div className="p-4 lg:p-6">
        <h1 className="text-xl lg:text-2xl font-bold text-blue-600 mb-6 lg:mb-8">TekPulse</h1>
        <ul className="space-y-1 lg:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-200 text-sm lg:text-base ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} className="lg:w-5 lg:h-5" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
