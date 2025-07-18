
import React from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';

const CampusMap = () => {
  const buildings = [
    { name: 'Main Library', x: 30, y: 40, color: 'bg-blue-500' },
    { name: 'Student Union', x: 60, y: 30, color: 'bg-green-500' },
    { name: 'Computer Science', x: 20, y: 60, color: 'bg-purple-500' },
    { name: 'Cafeteria', x: 70, y: 50, color: 'bg-orange-500' },
    { name: 'Gymnasium', x: 80, y: 70, color: 'bg-red-500' },
    { name: 'Administration', x: 50, y: 20, color: 'bg-yellow-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Campus Map</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search buildings..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
            <Navigation size={20} />
            <span>Get Directions</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-8 relative h-96 overflow-hidden border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800"
              alt="Campus aerial view"
              className="absolute inset-0 w-full h-full object-cover opacity-30 rounded-lg"
            />
            <div className="relative z-10">
              {buildings.map((building, index) => (
                <div
                  key={index}
                  className={`absolute w-4 h-4 ${building.color} rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform`}
                  style={{ left: `${building.x}%`, top: `${building.y}%` }}
                  title={building.name}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-lg opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                    {building.name}
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin size={16} className="text-blue-600" />
                <span className="font-medium">University Campus</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Access</h3>
            <div className="space-y-2">
              {buildings.map((building, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <div className={`w-3 h-3 ${building.color} rounded-full`}></div>
                  <span className="text-sm font-medium">{building.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Campus Info</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <span className="font-medium">Total Area:</span> 250 acres
              </div>
              <div>
                <span className="font-medium">Buildings:</span> 45
              </div>
              <div>
                <span className="font-medium">Parking Lots:</span> 12
              </div>
              <div>
                <span className="font-medium">Emergency:</span> Call 911
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-700 mb-3">
              Can't find a building? Contact campus security for assistance.
            </p>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Contact Security
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusMap;
