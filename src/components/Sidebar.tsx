import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartBar, 
  faTachometerAlt, 
  faUsers, 
  faPuzzlePiece, 
  faRobot, 
  faTags,
  faBell,
  faChevronDown,
  faChevronRight,
  faUserGroup,
  faImage,
  faChevronLeft,
  faBars,
  faCalendarAlt,
  faFileAlt,
  faTools,
  faPhotoVideo,
  faCode
} from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setCurrentPage: (page: string) => void;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, setCurrentPage, currentPage }) => {
  const sidebarClass = isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded';
  const [campaignSubmenuExpanded, setCampaignSubmenuExpanded] = useState(false);
  const [aiPlannerSubmenuExpanded, setAiPlannerSubmenuExpanded] = useState(false);

  const toggleCampaignSubmenu = () => {
    setCampaignSubmenuExpanded(!campaignSubmenuExpanded);
  };

  const toggleAiPlannerSubmenu = () => {
    setAiPlannerSubmenuExpanded(!aiPlannerSubmenuExpanded);
  };

  return (
    <div id="sidebar" className={`${sidebarClass} bg-sidebar border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out`}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800 sidebar-logo-text">ADSIGHTFUL</h1>
        </div>
        <button 
          id="sidebar-toggle" 
          className={`p-1 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150 ${isCollapsed ? 'sidebar-toggle-collapsed' : ''}`}
          aria-expanded={!isCollapsed} 
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon 
            icon={isCollapsed ? faBars : faChevronLeft} 
            className="h-6 w-6" 
          />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto" aria-label="Main Navigation">
        <div className="px-4 space-y-1">
          {/* AI Campaign Planner with submenu */}
          <div>
            <button 
              className={`flex items-center justify-between w-full px-4 py-3 ${
                currentPage === 'ai-planner' || 
                currentPage === 'campaign-planner' ||
                currentPage === 'creative-assets' ||
                currentPage === 'taxonomy-utm' ||
                currentPage === 'media-plan' ||
                currentPage === 'campaign-builder'
                ? 'active-nav-item' : 'text-gray-600 hover:bg-gray-100'
              } rounded-lg focus-visible transition-colors duration-150 text-left`}
              onClick={toggleAiPlannerSubmenu}
            >
              <div className="flex items-center">
                <FontAwesomeIcon icon={faRobot} className="h-5 w-5 mr-3 text-gray-500" />
                <span className="nav-text">AI campaign planner</span>
              </div>
              <FontAwesomeIcon 
                icon={aiPlannerSubmenuExpanded ? faChevronDown : faChevronRight} 
                className="h-3 w-3 text-gray-500" 
              />
            </button>
            
            {/* AI Planner Submenu items */}
            {aiPlannerSubmenuExpanded && (
              <div className="ml-8 mt-1 space-y-1">
                <button 
                  className={`flex items-center w-full px-4 py-2 ${currentPage === 'campaign-planner' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'} rounded-lg focus-visible transition-colors duration-150 text-left text-sm`}
                  onClick={() => setCurrentPage('campaign-planner')}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="nav-text">Campaign planner</span>
                </button>
                <button 
                  className={`flex items-center w-full px-4 py-2 ${currentPage === 'creative-assets' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'} rounded-lg focus-visible transition-colors duration-150 text-left text-sm`}
                  onClick={() => setCurrentPage('creative-assets')}
                >
                  <FontAwesomeIcon icon={faPhotoVideo} className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="nav-text">Creative Assets library</span>
                </button>
                <button 
                  className={`flex items-center w-full px-4 py-2 ${currentPage === 'taxonomy-utm' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'} rounded-lg focus-visible transition-colors duration-150 text-left text-sm`}
                  onClick={() => setCurrentPage('taxonomy-utm')}
                >
                  <FontAwesomeIcon icon={faCode} className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="nav-text">Taxonomy and UTM builder</span>
                </button>
                <button 
                  className={`flex items-center w-full px-4 py-2 ${currentPage === 'media-plan' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'} rounded-lg focus-visible transition-colors duration-150 text-left text-sm`}
                  onClick={() => setCurrentPage('media-plan')}
                >
                  <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="nav-text">Media plan</span>
                </button>
                <button 
                  className={`flex items-center w-full px-4 py-2 ${currentPage === 'campaign-builder' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'} rounded-lg focus-visible transition-colors duration-150 text-left text-sm`}
                  onClick={() => setCurrentPage('campaign-builder')}
                >
                  <FontAwesomeIcon icon={faTools} className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="nav-text">Campaign builder</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Campaign Metrics with submenu */}
          <div>
            <button 
              className={`flex items-center justify-between w-full px-4 py-3 ${
                currentPage === 'campaign-metrics' || 
                currentPage === 'audience-metrics' || 
                currentPage === 'creative-metrics' 
                ? 'active-nav-item' : 'text-gray-600 hover:bg-gray-100'
              } rounded-lg focus-visible transition-colors duration-150 text-left`}
              onClick={toggleCampaignSubmenu}
            >
              <div className="flex items-center">
                <FontAwesomeIcon icon={faChartBar} className="h-5 w-5 mr-3 text-gray-500" />
                <span className="nav-text">Campaign level Metrics</span>
              </div>
              <FontAwesomeIcon 
                icon={campaignSubmenuExpanded ? faChevronDown : faChevronRight} 
                className="h-3 w-3 text-gray-500" 
              />
            </button>
            
            {/* Submenu items */}
            {campaignSubmenuExpanded && (
              <div className="ml-8 mt-1 space-y-1">
                <button 
                  className={`flex items-center w-full px-4 py-2 ${currentPage === 'campaign-metrics' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'} rounded-lg focus-visible transition-colors duration-150 text-left text-sm`}
                  onClick={() => setCurrentPage('campaign-metrics')}
                >
                  <FontAwesomeIcon icon={faChartBar} className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="nav-text">Overview</span>
                </button>
                <button 
                  className={`flex items-center w-full px-4 py-2 ${currentPage === 'audience-metrics' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'} rounded-lg focus-visible transition-colors duration-150 text-left text-sm`}
                  onClick={() => setCurrentPage('audience-metrics')}
                >
                  <FontAwesomeIcon icon={faUserGroup} className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="nav-text">Audience metrics</span>
                </button>
                <button 
                  className={`flex items-center w-full px-4 py-2 ${currentPage === 'creative-metrics' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'} rounded-lg focus-visible transition-colors duration-150 text-left text-sm`}
                  onClick={() => setCurrentPage('creative-metrics')}
                >
                  <FontAwesomeIcon icon={faImage} className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="nav-text">Creative metrics</span>
                </button>
              </div>
            )}
          </div>
          
          <button 
            className={`flex items-center w-full px-4 py-3 ${currentPage === 'performance-insights' ? 'active-nav-item' : 'text-gray-600 hover:bg-gray-100'} rounded-lg focus-visible transition-colors duration-150 text-left`}
            onClick={() => setCurrentPage('performance-insights')}
          >
            <FontAwesomeIcon icon={faBell} className="h-5 w-5 mr-3 text-gray-500" />
            <span className="nav-text">Performance Insights</span>
          </button>
          <button 
            className={`flex items-center w-full px-4 py-3 ${currentPage === 'team-settings' ? 'active-nav-item' : 'text-gray-600 hover:bg-gray-100'} rounded-lg focus-visible transition-colors duration-150 text-left`}
            onClick={() => setCurrentPage('team-settings')}
          >
            <FontAwesomeIcon icon={faUsers} className="h-5 w-5 mr-3 text-gray-500" />
            <span className="nav-text">Team settings</span>
          </button>
          <button 
            className={`flex items-center w-full px-4 py-3 ${currentPage === 'integrations' ? 'active-nav-item' : 'text-gray-600 hover:bg-gray-100'} rounded-lg focus-visible transition-colors duration-150 text-left`}
            onClick={() => setCurrentPage('integrations')}
          >
            <FontAwesomeIcon icon={faPuzzlePiece} className="h-5 w-5 mr-3 text-gray-500" />
            <span className="nav-text">Integrations</span>
          </button>
          <button 
            className={`flex items-center w-full px-4 py-3 ${currentPage === 'taxonomy' ? 'active-nav-item' : 'text-gray-600 hover:bg-gray-100'} rounded-lg focus-visible transition-colors duration-150 text-left`}
            onClick={() => setCurrentPage('taxonomy')}
          >
            <FontAwesomeIcon icon={faTags} className="h-5 w-5 mr-3 text-gray-500" />
            <span className="nav-text">Taxonomy creator</span>
          </button>
        </div>
      </nav>
      
      {/* Sidebar Footer with User Menu */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <img 
            src="https://ui-avatars.com/api/?name=User&background=0369a1&color=fff" 
            alt="User profile" 
            className="h-8 w-8 rounded-full"
          />
          <div className="ml-3 sidebar-footer-text">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500">View profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 