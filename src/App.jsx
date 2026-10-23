import React, { useState } from 'react';
import { Camera, LayoutGrid, Bell, BarChart3, Settings } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('live');

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">
            <Camera size={22} />
          </div>
          <div className="brand-text">
            <h1>RestoVision AI</h1>
            <p>Smart Dining Floor Monitor</p>
          </div>
        </div>

        <nav className="nav-center">
          <button 
            className={`nav-tab ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            <Camera size={16} /> Live CCTV Perception
          </button>
          <button 
            className={`nav-tab ${activeTab === 'floor' ? 'active' : ''}`}
            onClick={() => setActiveTab('floor')}
          >
            <LayoutGrid size={16} /> Floor Plan
          </button>
          <button 
            className={`nav-tab ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <Bell size={16} /> Dispatch Alerts
          </button>
          <button 
            className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={16} /> Peak Hour Scheduling
          </button>
        </nav>

        <div className="nav-right">
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span>LIVE CAM 01</span>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <p style={{ color: 'var(--text-secondary)' }}>System initialized.</p>
      </main>
    </div>
  );
}
