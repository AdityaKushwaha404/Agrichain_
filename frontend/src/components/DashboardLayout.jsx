import React, { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import Sidebar from './Sidebar.jsx';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50/30 via-teal-50/20 to-green-50/30">
      {/* Navbar - Full width */}
      <Navbar onDashboardMenuToggle={toggleSidebar} showDashboardMenu={true} />
      
      <div className="flex flex-1 relative min-w-0 overflow-x-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Main content area - offset by sidebar on desktop */}
        <div className="flex-1 lg:ml-72 flex flex-col min-w-0 overflow-x-hidden">
          {/* Page content */}
          <main className="flex-1 min-w-0 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
      
      {/* Footer - Full width */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;