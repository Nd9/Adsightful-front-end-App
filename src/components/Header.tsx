import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar, 
  faChevronDown,
  faSearch,
  faBell,
  faQuestionCircle,
  faUser,
  faBars,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { authService } from '../services/auth';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarCollapsed }) => {
  const [isDateRangeOpen, setDateRangeOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [companyName, setCompanyName] = useState('Adsightful');

  const toggleDateRange = () => {
    setDateRangeOpen(!isDateRangeOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.reload(); // Reload the app to show login page
  };

  // Load company name from auth service
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCompanyName(user.companyName);
    }

    // Subscribe to authentication changes
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      setCompanyName(currentUser?.companyName || 'Adsightful');
    };

    // Check for auth changes every 5 seconds (a more elegant solution would use proper events/state management)
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-800">{companyName}</h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* Date Range Selector */}
            <div 
              className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer" 
              onClick={toggleDateRange}
            >
              <FontAwesomeIcon icon={faCalendar} className="h-5 w-5 text-blue-600 mr-2" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500">Date Range</span>
                <span className="text-sm font-medium text-gray-700">Last 30 days</span>
              </div>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className="h-5 w-5 text-gray-500 ml-2" 
                style={{ transform: isDateRangeOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </div>

            {/* Search */}
            <div className="relative">
              <div className="flex items-center bg-gray-100 rounded-lg">
                <input 
                  type="text" 
                  placeholder="Search campaigns..." 
                  className="bg-gray-100 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" 
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <FontAwesomeIcon icon={faBell} className="h-6 w-6" />
            </button>

            {/* Help */}
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <FontAwesomeIcon icon={faQuestionCircle} className="h-6 w-6" />
            </button>

            {/* User Menu */}
            <div className="ml-3 relative">
              <div>
                <button 
                  className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                  id="user-menu" 
                  aria-haspopup="true"
                  onClick={toggleUserMenu}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                  </div>
                </button>
              </div>
              
              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" 
                  role="menu" 
                  aria-orientation="vertical" 
                  aria-labelledby="user-menu"
                >
                  {authService.getCurrentUser() && (
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      <p className="font-medium">{authService.getCurrentUser()?.email}</p>
                      <p className="text-gray-500">{authService.getCurrentUser()?.companyName}</p>
                    </div>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    role="menuitem"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-gray-400" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Modal (hidden by default) */}
      {isDateRangeOpen && (
        <div className="absolute top-16 right-20 bg-white shadow-lg rounded-lg border border-gray-200 p-4 z-20 animate-fade-in" style={{ width: '320px' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Select Date Range</h3>
            <button 
              className="text-gray-400 hover:text-gray-500" 
              onClick={toggleDateRange}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            <button className="w-full p-2 text-left bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Last 7 days
            </button>
            <button className="w-full p-2 text-left bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Last 30 days
            </button>
            <button className="w-full p-2 text-left bg-gray-50 text-gray-700 rounded-md text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Last 90 days
            </button>
            <button className="w-full p-2 text-left bg-gray-50 text-gray-700 rounded-md text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Year to date
            </button>
            <div className="pt-2 border-t border-gray-200 mt-2">
              <div className="text-xs font-medium text-gray-500 mb-2">Custom Range</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500">Start Date</label>
                  <input type="date" className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">End Date</label>
                  <input type="date" className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm" />
                </div>
              </div>
              <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Apply Custom Range
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 