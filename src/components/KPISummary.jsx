import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Users, Clock, AlertTriangle, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';

export default function KPISummary() {
  const { stats } = useRestaurant();

  return (
    <div className="kpi-grid">
      {/* Total Occupancy */}
      <div className="kpi-card">
        <div className="kpi-icon-box" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
          <Users size={22} />
        </div>
        <div className="kpi-info">
          <h3>Floor Occupancy</h3>
          <div className="kpi-value">{stats.occupancyRate}%</div>
          <div className="kpi-subtext">{stats.occupiedCount} of {stats.totalTables} Tables Active</div>
        </div>
      </div>

      {/* 5-Min SLA Alerts */}
      <div className="kpi-card" style={stats.urgentCount > 0 ? { borderColor: 'rgba(239, 68, 68, 0.5)', background: 'rgba(239, 68, 68, 0.08)' } : {}}>
        <div className="kpi-icon-box" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
          <AlertTriangle size={22} />
        </div>
        <div className="kpi-info">
          <h3 style={stats.urgentCount > 0 ? { color: '#f87171' } : {}}>Wait &gt; 5m Alerts</h3>
          <div className="kpi-value" style={stats.urgentCount > 0 ? { color: '#ef4444' } : {}}>
            {stats.urgentCount}
          </div>
          <div className="kpi-subtext">{stats.urgentCount > 0 ? 'Requires immediate server' : 'All tables served'}</div>
        </div>
      </div>

      {/* Cleaning Queue */}
      <div className="kpi-card">
        <div className="kpi-icon-box" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
          <Sparkles size={22} />
        </div>
        <div className="kpi-info">
          <h3>Needs Cleaning</h3>
          <div className="kpi-value" style={{ color: '#f97316' }}>{stats.cleaningCount}</div>
          <div className="kpi-subtext">{stats.cleaningCount} Tables Vacated</div>
        </div>
      </div>

      {/* Tables Ready / Free */}
      <div className="kpi-card">
        <div className="kpi-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
          <CheckCircle size={22} />
        </div>
        <div className="kpi-info">
          <h3>Available Tables</h3>
          <div className="kpi-value" style={{ color: '#10b981' }}>{stats.freeCount}</div>
          <div className="kpi-subtext">Clean & ready to seat</div>
        </div>
      </div>

      {/* Turnaround Time */}
      <div className="kpi-card">
        <div className="kpi-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
          <Clock size={22} />
        </div>
        <div className="kpi-info">
          <h3>Avg Response Time</h3>
          <div className="kpi-value" style={{ color: '#a78bfa' }}>{stats.avgWaitTime}</div>
          <div className="kpi-subtext">Table turnover: {stats.turnaroundTime}</div>
        </div>
      </div>
    </div>
  );
}
