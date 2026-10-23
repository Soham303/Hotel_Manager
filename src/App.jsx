import React, { useState } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import CCTVFeed from './components/CCTVFeed';
import KPISummary from './components/KPISummary';
import FloorPlanGrid from './components/FloorPlanGrid';
import AlertsDispatch from './components/AlertsDispatch';
import { Camera, LayoutGrid, Bell, BarChart3, ShieldCheck, Sparkles, Volume2, VolumeX } from 'lucide-react';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('live');
  const { alerts, stats, soundEnabled, setSoundEnabled } = useRestaurant();

  const unresolvedAlertsCount = alerts.filter(a => !a.resolved).length;

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">
            <Camera size={22} />
          </div>
          <div className="brand-text">
            <h1>RestoVision AI</h1>
            <p>Computer Vision Dining Floor Intelligence</p>
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
            <LayoutGrid size={16} /> Floor Plan ({stats.totalTables})
          </button>
          <button 
            className={`nav-tab ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
            style={{ position: 'relative' }}
          >
            <Bell size={16} /> Dispatch Alerts
            {unresolvedAlertsCount > 0 && (
              <span className="badge-counter">{unresolvedAlertsCount}</span>
            )}
          </button>
          <button 
            className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={16} /> Peak Hour Scheduling
          </button>
        </nav>

        <div className="nav-right">
          <button
            className="icon-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Alert Audio' : 'Unmute Alert Audio'}
          >
            {soundEnabled ? <Volume2 size={16} color="#10b981" /> : <VolumeX size={16} />}
          </button>

          <div className="live-indicator">
            <span className="live-dot"></span>
            <span>LIVE CAM 04</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* KPI Summary Banner */}
        <KPISummary />

        {/* View Selection */}
        {activeTab === 'live' && (
          <div className="content-grid">
            <CCTVFeed />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <FloorPlanGrid />
              <AlertsDispatch />
            </div>
          </div>
        )}

        {activeTab === 'floor' && (
          <FloorPlanGrid />
        )}

        {activeTab === 'alerts' && (
          <div className="content-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
            <AlertsDispatch />
            <FloorPlanGrid />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div style={{ color: 'var(--text-secondary)' }}>Analytics section loading...</div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <RestaurantProvider>
      <Dashboard />
    </RestaurantProvider>
  );
}
