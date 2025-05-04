import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PerformanceInsights from './components/PerformanceInsights';
import Integrations from './components/Integrations';
import AICampaignPlanner from './components/AICampaignPlanner';
import AudienceMetrics from './components/AudienceMetrics';
import CreativeMetrics from './components/CreativeMetrics';
import { track } from '@vercel/analytics';

const App: React.FC = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('campaign-metrics');

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  // Track page navigation
  const handlePageChange = (pageName: string) => {
    // Update current page
    setCurrentPage(pageName);
    
    // Track the navigation event with Vercel Analytics
    track('page_view', { 
      page: pageName,
      timestamp: new Date().toISOString()
    });
    
    console.log(`Navigation tracked: ${pageName}`);
  };

  // Add event listener for custom setCurrentPage event
  useEffect(() => {
    const handleSetCurrentPage = (event: CustomEvent) => {
      if (event.detail) {
        handlePageChange(event.detail);
      }
    };

    window.addEventListener('setCurrentPage', handleSetCurrentPage as EventListener);
    
    // Track initial page view
    track('page_view', { 
      page: currentPage,
      isInitial: true,
      timestamp: new Date().toISOString()
    });
    
    return () => {
      window.removeEventListener('setCurrentPage', handleSetCurrentPage as EventListener);
    };
  }, []);

  // Function to render the correct page based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'campaign-metrics':
        return <Dashboard />; // Show dashboard for campaign metrics too for now
      case 'audience-metrics':
        return <AudienceMetrics />; // Use our new AudienceMetrics component
      case 'creative-metrics':
        return <CreativeMetrics />; // Use our new CreativeMetrics component
      case 'performance-insights':
        return <PerformanceInsights />;
      case 'integrations':
        return <Integrations />;
      case 'ai-planner': // Main AI campaign planner page
        return <AICampaignPlanner />;
      // New AI Campaign Planner submenu pages
      case 'campaign-planner': // Campaign Planner submenu
        return <AICampaignPlanner pageName="Campaign Planner" />;
      case 'media-plan':
        return <AICampaignPlanner pageName="Media Plan" />;
      case 'campaign-builder':
        return <AICampaignPlanner pageName="Campaign Builder" />;
      case 'creative-assets':
        return <AICampaignPlanner pageName="Creative Assets Library" />;
      case 'taxonomy-utm':
        return <AICampaignPlanner pageName="Taxonomy and UTM Builder" />;
      default:
        return <Dashboard />; // Still using Dashboard component but for 'campaign-metrics' page
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar}
        setCurrentPage={handlePageChange}
        currentPage={currentPage}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          toggleSidebar={toggleSidebar} 
          isSidebarCollapsed={isSidebarCollapsed} 
        />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
