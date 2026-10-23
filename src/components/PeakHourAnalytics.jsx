import React, { useState } from 'react';
import { 
  BarChart3, Users, Clock, TrendingUp, Sparkles, Calendar, 
  ChevronRight, AlertCircle, Award, ArrowUpRight, DollarSign
} from 'lucide-react';

const HOURLY_OCCUPANCY_DATA = [
  { hour: '11:00', label: '11 AM', occupancy: 25, covers: 12, waitersNeeded: 2, level: 'low' },
  { hour: '12:00', label: '12 PM', occupancy: 82, covers: 48, waitersNeeded: 4, level: 'peak' },
  { hour: '13:00', label: '1 PM', occupancy: 96, covers: 56, waitersNeeded: 5, level: 'peak' },
  { hour: '14:00', label: '2 PM', occupancy: 65, covers: 34, waitersNeeded: 3, level: 'high' },
  { hour: '15:00', label: '3 PM', occupancy: 30, covers: 16, waitersNeeded: 2, level: 'low' },
  { hour: '16:00', label: '4 PM', occupancy: 38, covers: 20, waitersNeeded: 2, level: 'low' },
  { hour: '17:00', label: '5 PM', occupancy: 55, covers: 32, waitersNeeded: 3, level: 'med' },
  { hour: '18:00', label: '6 PM', occupancy: 78, covers: 44, waitersNeeded: 4, level: 'high' },
  { hour: '19:00', label: '7 PM', occupancy: 98, covers: 62, waitersNeeded: 6, level: 'peak' },
  { hour: '20:00', label: '8 PM', occupancy: 95, covers: 58, waitersNeeded: 6, level: 'peak' },
  { hour: '21:00', label: '9 PM', occupancy: 74, covers: 40, waitersNeeded: 4, level: 'high' },
  { hour: '22:00', label: '10 PM', occupancy: 42, covers: 22, waitersNeeded: 2, level: 'low' }
];

export default function PeakHourAnalytics() {
  const [selectedHour, setSelectedHour] = useState(HOURLY_OCCUPANCY_DATA[8]); // 7 PM Peak
  const [dayFilter, setDayFilter] = useState('Friday');

  return (
    <div className="analytics-section">
      {/* Top Banner: AI Scheduling Insights */}
      <div className="glass-panel">
        <div className="panel-header">
          <div className="panel-title">
            <BarChart3 size={18} color="#38bdf8" />
            <span>Peak Hour Dining Traffic & AI Waiter Scheduling</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              [PREDICTIVE DISPATCH]
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <button
                key={day}
                onClick={() => setDayFilter(day)}
                className={`btn-secondary ${dayFilter === day ? 'active' : ''}`}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.65rem',
                  ...(dayFilter === day ? { borderColor: '#3b82f6', color: '#60a5fa' } : {})
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.25rem' }}>
          {/* Heatmap Bar Chart */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                Hourly Occupancy Heatmap & Volume Distribution
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Based on continuous CCTV computer vision analysis across 1,420 table turnovers.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 10, height: 10, background: '#3b82f6', borderRadius: 2 }}></span> Low (&lt;40%)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 10, height: 10, background: '#10b981', borderRadius: 2 }}></span> Med (40-70%)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 10, height: 10, background: '#f59e0b', borderRadius: 2 }}></span> High (70-90%)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 10, height: 10, background: '#ef4444', borderRadius: 2 }}></span> Peak (&gt;90%)
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="heatmap-bar-chart">
            {HOURLY_OCCUPANCY_DATA.map((item) => {
              const isSelected = selectedHour.hour === item.hour;
              return (
                <div
                  key={item.hour}
                  className="heatmap-col"
                  onClick={() => setSelectedHour(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="heatmap-val" style={isSelected ? { color: '#38bdf8' } : {}}>
                    {item.occupancy}%
                  </span>
                  <div
                    className={`heatmap-bar level-${item.level}`}
                    style={{
                      height: `${item.occupancy}%`,
                      border: isSelected ? '2px solid #ffffff' : 'none'
                    }}
                  ></div>
                  <span
                    className="heatmap-label"
                    style={isSelected ? { color: '#ffffff', fontWeight: 700 } : {}}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Section: Scheduling Recommender & Efficiency ROI */}
      <div className="content-grid" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
        {/* AI Waiter Scheduling Card */}
        <div className="glass-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Users size={17} color="#a78bfa" />
              <span>AI Waiter Shift Recommendation — {selectedHour.label}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
              Optimal Coverage Engine
            </div>
          </div>

          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Projected Covers</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedHour.covers} Guests
                </div>
                <div style={{ fontSize: '0.72rem', color: selectedHour.level === 'peak' ? '#ef4444' : '#10b981' }}>
                  {selectedHour.level === 'peak' ? '🔥 Maximum Dinner Surge' : 'Normal Floor Capacity'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recommended Staff</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#38bdf8' }}>
                  {selectedHour.waitersNeeded} Servers + {Math.max(1, Math.floor(selectedHour.waitersNeeded / 2))} Bussers
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Prevents 5m Wait Breaches
                </div>
              </div>
            </div>

            {/* Shift Assignment Roster */}
            <div>
              <h5 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                Recommended Shift Roster for {selectedHour.label}:
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {[
                  { name: 'David Silva', role: 'Lead Floor Waiter', zone: 'T01 - T03 (Center Dining)' },
                  { name: 'Sophia Martinez', role: 'Server', zone: 'T04 - T06 (Window Area)' },
                  ...(selectedHour.waitersNeeded >= 4
                    ? [
                        { name: 'Marcus Lee', role: 'Fast-Response Server', zone: 'Floating / Urgent Queue' },
                        { name: 'Liam Ross', role: 'Busser & Table Reset', zone: 'Dishes & Sanitization' }
                      ]
                    : []),
                  ...(selectedHour.waitersNeeded >= 6
                    ? [
                        { name: 'Chloe Kim', role: 'Beverage & Greeting Specialist', zone: 'Fast 1-Min Contact' },
                        { name: 'Elena Vance', role: 'Busser Lead', zone: 'Rapid 3-Min Table Turn' }
                      ]
                    : [])
                ].map((staff, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      background: 'var(--bg-surface-elevated)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{staff.name}</strong>
                      <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({staff.role})</span>
                    </div>
                    <span style={{ color: '#93c5fd', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                      {staff.zone}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Operational ROI & Table Turnover Gains */}
        <div className="glass-panel">
          <div className="panel-header">
            <div className="panel-title">
              <TrendingUp size={17} color="#10b981" />
              <span>RestoVision Operational Impact</span>
            </div>
          </div>

          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#6ee7b7' }}>First Contact Wait Time</span>
                <strong style={{ color: '#10b981', fontSize: '1rem' }}>-65% Reduction</strong>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Dropped from 6m 30s to 2m 14s. Customers never sit ignored.
              </p>
            </div>

            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#93c5fd' }}>Table Turnaround Speed</span>
                <strong style={{ color: '#38bdf8', fontSize: '1rem' }}>+26% Faster Turnover</strong>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Tables cleaned and sanitized within 3.5 minutes of guest departure.
              </p>
            </div>

            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#fcd34d' }}>Labor Cost Optimization</span>
                <strong style={{ color: '#f59e0b', fontSize: '1rem' }}>~$840 / Week Saved</strong>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Eliminates overstaffing in slow hours (3-5 PM) while maximizing peak covers.
              </p>
            </div>

            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.25)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#c4b5fd' }}>Existing Security Cameras</span>
                <strong style={{ color: '#a78bfa', fontSize: '1rem' }}>Zero New Hardware</strong>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Operates seamlessly with any standard RTSP IP / CCTV surveillance system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
