
import React from 'react';
import { Home, MapPin, Calendar, ShoppingBag, AlertTriangle } from 'lucide-react';

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const MobileNavigation = ({ activeSection, onSectionChange }: MobileNavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'lost-found', label: 'Lost', icon: AlertTriangle },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'resources', label: 'Resources', icon: Calendar },
    { id: 'marketplace', label: 'Market', icon: ShoppingBag },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20 lg:hidden">
        <h1 className="text-xl font-bold text-blue-600">StudentHub</h1>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 lg:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                  activeSection === item.id
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="text-xs font-medium truncate w-full text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileNavigation;
