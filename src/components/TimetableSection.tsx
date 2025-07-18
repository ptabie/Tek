
import React, { useState } from 'react';
import { Calendar, Clock, Plus, BookOpen } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  type: 'class' | 'exam' | 'assignment' | 'event';
  time: string;
  location: string;
  date: string;
  color: string;
}

const TimetableSection = () => {
  const [activeView, setActiveView] = useState('week');
  
  const events: Event[] = [
    {
      id: '1',
      title: 'Data Structures',
      type: 'class',
      time: '09:00 - 10:30',
      location: 'CS Building - Room 101',
      date: 'Mon',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Calculus II',
      type: 'class',
      time: '11:00 - 12:30',
      location: 'Math Building - Room 205',
      date: 'Mon',
      color: 'bg-green-500'
    },
    {
      id: '3',
      title: 'Physics Lab',
      type: 'class',
      time: '14:00 - 16:00',
      location: 'Physics Lab - Room 301',
      date: 'Tue',
      color: 'bg-purple-500'
    },
    {
      id: '4',
      title: 'Database Systems Exam',
      type: 'exam',
      time: '10:00 - 12:00',
      location: 'Main Hall',
      date: 'Wed',
      color: 'bg-red-500'
    },
    {
      id: '5',
      title: 'Programming Assignment Due',
      type: 'assignment',
      time: '23:59',
      location: 'Online Submission',
      date: 'Thu',
      color: 'bg-yellow-500'
    }
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Academic Calendar</h2>
        <div className="flex space-x-3">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {['week', 'month'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === view
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {activeView === 'week' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-6 border-b border-gray-200">
            <div className="p-4 bg-gray-50"></div>
            {days.map((day) => (
              <div key={day} className="p-4 bg-gray-50 text-center font-medium text-gray-900 border-l border-gray-200">
                {day}
              </div>
            ))}
          </div>
          
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-6 border-b border-gray-200 min-h-16">
              <div className="p-4 text-sm text-gray-600 bg-gray-50 border-r border-gray-200">
                {time}
              </div>
              {days.map((day) => {
                const dayEvents = events.filter(event => event.date === day && event.time.startsWith(time.slice(0, 2)));
                return (
                  <div key={`${day}-${time}`} className="p-2 border-l border-gray-200 relative">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`${event.color} text-white p-2 rounded text-xs mb-1 cursor-pointer hover:opacity-90 transition-opacity`}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="opacity-90">{event.time}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {activeView === 'month' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Classes</h3>
            </div>
            <div className="space-y-3">
              {events.filter(e => e.type === 'class').map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 ${event.color} rounded-full`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-600">{event.date} • {event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="text-red-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">Exams & Assignments</h3>
            </div>
            <div className="space-y-3">
              {events.filter(e => e.type === 'exam' || e.type === 'assignment').map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 ${event.color} rounded-full`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-600">{event.date} • {event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900">5 Classes</div>
                <div className="text-sm text-blue-700">Scheduled this week</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="font-medium text-red-900">2 Deadlines</div>
                <div className="text-sm text-red-700">Coming up soon</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-900">1 Exam</div>
                <div className="text-sm text-green-700">Don't forget to study!</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableSection;
