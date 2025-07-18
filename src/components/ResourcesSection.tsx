import React, { useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Clock,
  GraduationCap,
  FileText,
  CreditCard,
  School
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface College {
  id: string;
  name: string;
  departments: string[];
  timetableUrl: string;
}

interface FeeStructure {
  category: string;
  amount: string;
  dueDate: string;
  description: string;
}

interface AcademicEvent {
  title: string;
  date: string;
  type: 'exam' | 'registration' | 'holiday' | 'deadline';
  description: string;
}

const ResourcesSection = () => {
  const [activeTab, setActiveTab] = useState('fees');
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [isCollegeDropdownOpen, setIsCollegeDropdownOpen] = useState(false);

  const colleges: College[] = [
    {
      id: 'science',
      name: 'College of Science',
      departments: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Statistics', 'Biochemistry', 'Human Nutrition', 'Optometry', 'Actuarial Science', 'Environmental Science', 'Meteorology and Climate Science', 'Food Science and Technology', 'Dietetics'],
      timetableUrl: '/timetables/science.pdf'
    },
    {
      id: 'engineering',
      name: 'College of Engineering',
      departments: ['Aerospace Engineering', 'Agricultural Engineering', 'Automobile Engineering', 'Biomedical Engineering', 'Chemical Engineering', 'Civil Engineering', 'Computer Engineering', 'Electrical/Electronic Engineering', 'Geological Engineering', 'Geomatic (Geodetic) Engineering', 'Industrial Engineering', 'Marine Engineering', 'Materials Engineering', 'Mechanical Engineering', 'Metallurgical Engineering', 'Petrochemical Engineering', 'Petroleum Engineering', 'Telecommunication Engineering'
],
      timetableUrl: '/timetables/engineering.pdf'
    },
    {
      id: 'art-built-environment',
      name: 'College of Art and Built Environment',
      departments: ['Architecture', 'Construction Technology and Management', 'Quantity Surveying and Construction Economics', 'Development Planning', 'Human Settlement Planning', 'Land Economy', 'Real Estate', 'Fine Art and Curatorial Practice', 'Communication Design (Graphic Design)', 'Integrated Rural Art and Industry', 'Publishing Studies', 'Metal Product Design Technology', 'Textile Design and Technology', 'Fashion Design', 'Ceramics Technology', 'Junior High School Specialism'
],
      timetableUrl: '/timetables/art-built-environment.pdf'
    },
    {
      id: 'agriculture',
      name: 'College of Agriculture and Natural Resources',
      departments: ['Agriculture', 'Agricultural Biotechnology', 'Agribusiness Management', 'Landscape Design and Management', 'Natural Resources Management', 'Forest Resources Technology', 'Aquaculture and Water Resources Management', 'Packaging Technology'
],
      timetableUrl: '/timetables/agriculture.pdf'
    },
    {
      id: 'humanities',
      name: 'College of Humanities and Social Sciences',
      departments: ['Akan Language and Culture', 'Economics', 'English', 'French and Francophone Studies', 'Geography and Rural Development', 'History', 'Linguistics', 'Media and Communication Studies', 'Political Studies', 'Public Administration', 'Religious Studies', 'Sociology', 'Social Work', 'Business Administration (Human Resource Mgt./Management)', 'Business Administration (Marketing/International Business)', 'Business Administration (Accounting/Banking and Finance)', 'Business Administration (Logistics and Supply Chain Mgt/Bus. Info. Tech.)', 'Hospitality and Tourism Management', 'LLB'],
      timetableUrl: '/timetables/humanities.pdf'
    },
    {
      id: 'health-sciences',
      name: 'College of Health Sciences',
      departments: ['Dental Surgery (BDS)', 'Doctor of Veterinary Medicine (DVM)', 'Disability and Rehabilitation Studies', 'Herbal Medicine (BHM)', 'Human Biology (Medicine)', 'Medical Laboratory Science', 'Medical Imaging', 'Midwifery', 'Nursing', 'Physiotherapy and Sports Science', 'Pharm D (Doctor of Pharmacy)'
],
      timetableUrl: '/timetables/health-sciences.pdf'
    }
  ];

  const feeStructure: FeeStructure[] = [
    {
      category: 'Academic Facility User Fees (Per Year)',
      amount: '₵2,500',
      dueDate: 'August 15, 2024',
      description: 'Main fees for all facilities used'
    },
    {
      category: 'Others',
      amount: '₵150',
      dueDate: 'August 1, 2024',
      description: 'Fees for other charges including all dues.'
    },
    {
      category: 'Practical Training',
      amount: '₵75',
      dueDate: 'August 15, 2024',
      description: 'Fees for practical training sessions.'
    },
    {
      category: 'Online Teaching Support',
      amount: '₵100',
      dueDate: 'August 15, 2024',
      description: 'Computer lab and online platform access'
    },
    {
      category: 'Student Activities Fee',
      amount: '$50',
      dueDate: 'August 15, 2024',
      description: 'Clubs, sports, and campus events'
    },
    {
      category: 'Health Services Fee',
      amount: '$125',
      dueDate: 'August 15, 2024',
      description: 'Campus health center and medical services'
    },
    {
      category: 'Parking Permit (Optional)',
      amount: '$200',
      dueDate: 'August 30, 2024',
      description: 'Annual parking permit for campus lots'
    },
    {
      category: 'Graduation Fee',
      amount: '$85',
      dueDate: 'April 1, 2024',
      description: 'Final semester graduation processing fee'
    }
  ];

  const academicCalendar: AcademicEvent[] = [
    {
      title: 'Fall Semester Registration Opens',
      date: 'July 15, 2024',
      type: 'registration',
      description: 'Online course registration begins for fall semester'
    },
    {
      title: 'Fall Semester Begins',
      date: 'August 28, 2024',
      type: 'deadline',
      description: 'First day of classes for fall semester'
    },
    {
      title: 'Labor Day Holiday',
      date: 'September 2, 2024',
      type: 'holiday',
      description: 'University closed - no classes'
    },
    {
      title: 'Add/Drop Deadline',
      date: 'September 6, 2024',
      type: 'deadline',
      description: 'Last day to add or drop courses without penalty'
    },
    {
      title: 'Midterm Exams',
      date: 'October 14-18, 2024',
      type: 'exam',
      description: 'Midterm examination period'
    },
    {
      title: 'Thanksgiving Break',
      date: 'November 25-29, 2024',
      type: 'holiday',
      description: 'University closed for Thanksgiving'
    },
    {
      title: 'Final Exams',
      date: 'December 9-13, 2024',
      type: 'exam',
      description: 'Final examination period'
    },
    {
      title: 'Fall Semester Ends',
      date: 'December 13, 2024',
      type: 'deadline',
      description: 'Last day of fall semester'
    },
    {
      title: 'Winter Break',
      date: 'December 14, 2024 - January 14, 2025',
      type: 'holiday',
      description: 'University closed for winter break'
    },
    {
      title: 'Spring Semester Registration',
      date: 'November 1, 2024',
      type: 'registration',
      description: 'Registration opens for spring semester'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-red-100 text-red-800';
      case 'registration':
        return 'bg-blue-100 text-blue-800';
      case 'holiday':
        return 'bg-green-100 text-green-800';
      case 'deadline':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCollegeSelect = (college: College) => {
    setSelectedCollege(college.id);
    setIsCollegeDropdownOpen(false);
  };

  const handleDownloadTimetable = (college: College) => {
    // In a real app, this would download the actual PDF
    alert(`Downloading timetable for ${college.name}...`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Resources</h1>
        <p className="text-gray-600">Access important academic information, fees, and schedules</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
        {[
          { id: 'fees', label: 'School Fees', icon: DollarSign },
          { id: 'calendar', label: 'Academic Calendar', icon: Calendar },
          { id: 'timetables', label: 'Timetables', icon: Clock }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* School Fees Tab */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="text-green-600" size={24} />
                <span>Fee Structure - Academic Year 2024-2025</span>
              </CardTitle>
              <CardDescription>
                Complete breakdown of all academic and administrative fees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {feeStructure.map((fee, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{fee.category}</h3>
                      <p className="text-sm text-gray-600 mt-1">{fee.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Due: {fee.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-600">{fee.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Payment Information</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Payments can be made online through the student portal</li>
                  <li>• Late payment fee of $25 applies after due date</li>
                  <li>• Payment plans available - contact Financial Aid office</li>
                  <li>• Scholarships and financial aid may reduce total fees</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Academic Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="text-blue-600" size={24} />
                <span>Academic Calendar 2024-2025</span>
              </CardTitle>
              <CardDescription>
                Important dates and deadlines for the academic year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {academicCalendar.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <p className="text-sm font-medium text-blue-600 mt-2">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Timetables Tab */}
      {activeTab === 'timetables' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <School className="text-purple-600" size={24} />
                <span>College Timetables</span>
              </CardTitle>
              <CardDescription>
                Select your college to access course schedules and timetables
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* College Dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your College
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsCollegeDropdownOpen(!isCollegeDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="text-gray-900">
                      {selectedCollege 
                        ? colleges.find(c => c.id === selectedCollege)?.name 
                        : 'Choose a college...'
                      }
                    </span>
                    {isCollegeDropdownOpen ? (
                      <ChevronUp className="text-gray-400" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={20} />
                    )}
                  </button>
                  
                  {isCollegeDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      {colleges.map((college) => (
                        <button
                          key={college.id}
                          onClick={() => handleCollegeSelect(college)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                        >
                          <div>
                            <div className="font-medium text-gray-900">{college.name}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              {college.departments.slice(0, 3).join(', ')}
                              {college.departments.length > 3 && ` +${college.departments.length - 3} more`}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected College Information */}
              {selectedCollege && (
                <div className="space-y-4">
                  {(() => {
                    const college = colleges.find(c => c.id === selectedCollege);
                    return college ? (
                      <div className="bg-blue-50 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-blue-900 mb-2">
                              {college.name}
                            </h3>
                            <div className="mb-4">
                              <h4 className="font-medium text-blue-800 mb-2">Departments:</h4>
                              <div className="flex flex-wrap gap-2">
                                {college.departments.map((dept, index) => (
                                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                                    {dept}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDownloadTimetable(college)}
                            className="ml-4 bg-blue-600 hover:bg-blue-700"
                          >
                            <Download size={16} className="mr-2" />
                            Download Timetable
                          </Button>
                        </div>
                        
                        <div className="mt-4 p-4 bg-white rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Timetable Information:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Updated for Fall 2024 semester</li>
                            <li>• Includes all course schedules and room assignments</li>
                            <li>• Available in PDF format for download</li>
                            <li>• Contact your department for any schedule changes</li>
                          </ul>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* General Timetable Information */}
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Clock className="text-green-600" size={20} />
                      <span>Class Timings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Period 1:</span>
                        <span>8:00 AM - 9:30 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Period 2:</span>
                        <span>9:45 AM - 11:15 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Period 3:</span>
                        <span>11:30 AM - 1:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Lunch Break:</span>
                        <span>1:00 PM - 2:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Period 4:</span>
                        <span>2:00 PM - 3:30 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Period 5:</span>
                        <span>3:45 PM - 5:15 PM</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <FileText className="text-orange-600" size={20} />
                      <span>Important Notes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Timetables are subject to change</li>
                      <li>• Check college notice boards for updates</li>
                      <li>• Lab sessions may have different timings</li>
                      <li>• Weekend classes scheduled separately</li>
                      <li>• Exam schedules released separately</li>
                      <li>• Contact academic office for queries</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResourcesSection;