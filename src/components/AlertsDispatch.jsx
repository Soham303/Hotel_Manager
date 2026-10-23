import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  Bell, AlertTriangle, Sparkles, CheckCircle2, UserCheck, 
  Clock, Filter, Volume2, ShieldAlert, Check, ArrowRight
} from 'lucide-react';

export default function AlertsDispatch() {
  const { 
    alerts, 
    dismissAlert, 
    assignWaiter, 
    markCleaned, 
    soundEnabled 
  } = useRestaurant();

  const [filter, setFilter] = useState('UNRESOLVED');
  const [selectedStaff, setSelectedStaff] = useState({});

  const STAFF_MEMBERS = ['David S.', 'Sophia M.', 'Marcus L.', 'Liam R.', 'Chloe K.'];

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'UNRESOLVED') return !alert.resolved;
    if (filter === 'URGENT') return alert.type === 'URGENT';
    if (filter === 'CLEANING') return alert.type === 'CLEANING';
    return true;
  });

  const handleStaffChange = (alertId, staffName) => {
    setSelectedStaff((prev) => ({ ...prev, [alertId]: staffName }));
  };

  const handleDispatch = (alert) => {
    const staff = selectedStaff[alert.id] || STAFF_MEMBERS[0];
    assignWaiter(alert.tableId, staff);
  };

  const formatTimeAgo = (date) => {
    const diffSec = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    return `${diffMin}m ago`;
  };

  return (
    <div className="glass-panel" style={{ flex: 1 }}>
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title">
          <Bell size={18} color="#ef4444" />
          <span>Real-Time Staff Dispatch & Alerts</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            [PRIORITY DISPATCH FEED]
          </span>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'UNRESOLVED', label: `Active (${alerts.filter((a) => !a.resolved).length})` },
            { id: 'URGENT', label: `🚨 Wait > 5m (${alerts.filter((a) => a.type === 'URGENT').length})` },
            { id: 'CLEANING', label: `🧹 Cleaning (${alerts.filter((a) => a.type === 'CLEANING').length})` },
            { id: 'ALL', label: `History (${alerts.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`btn-secondary ${filter === tab.id ? 'active' : ''}`}
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                ...(filter === tab.id ? { borderColor: '#3b82f6', color: '#60a5fa' } : {})
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="alerts-container">
        {filteredAlerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>All Floor Alerts Handled</p>
            <p style={{ fontSize: '0.8rem' }}>No active waiter breaches or uncleaned tables pending.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isUrgent = alert.type === 'URGENT';
            const isCleaning = alert.type === 'CLEANING';

            return (
              <div
                key={alert.id}
                className={`alert-item ${
                  isUrgent ? 'alert-urgent' : isCleaning ? 'alert-cleaning' : ''
                } ${alert.resolved ? 'resolved-dim' : ''}`}
                style={alert.resolved ? { opacity: 0.65 } : {}}
              >
                {/* Alert Icon */}
                <div className="alert-icon-wrap">
                  {isUrgent && <AlertTriangle size={18} />}
                  {isCleaning && <Sparkles size={18} />}
                  {!isUrgent && !isCleaning && <Clock size={18} />}
                </div>

                {/* Alert Details */}
                <div className="alert-content">
                  <div className="alert-header">
                    <span className="alert-title">
                      {alert.title} — Table {alert.tableId}
                    </span>
                    <span className="alert-time">{formatTimeAgo(alert.timestamp)}</span>
                  </div>

                  <p className="alert-message">{alert.message}</p>

                  {/* Actions Bar for Unresolved Alerts */}
                  {!alert.resolved && (
                    <div className="alert-actions">
                      {isUrgent && (
                        <>
                          <select
                            value={selectedStaff[alert.id] || STAFF_MEMBERS[0]}
                            onChange={(e) => handleStaffChange(alert.id, e.target.value)}
                            style={{
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--border-light)',
                              color: 'var(--text-primary)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.35rem 0.6rem',
                              fontSize: '0.75rem'
                            }}
                          >
                            {STAFF_MEMBERS.map((staff) => (
                              <option key={staff} value={staff}>
                                {staff} (Floor Server)
                              </option>
                            ))}
                          </select>

                          <button
                            className="btn-primary"
                            style={{
                              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                              fontSize: '0.75rem',
                              padding: '0.35rem 0.75rem'
                            }}
                            onClick={() => handleDispatch(alert)}
                          >
                            <UserCheck size={14} /> Dispatch to Table
                          </button>
                        </>
                      )}

                      {isCleaning && (
                        <button
                          className="btn-primary"
                          style={{
                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                            fontSize: '0.75rem',
                            padding: '0.35rem 0.75rem'
                          }}
                          onClick={() => markCleaned(alert.tableId)}
                        >
                          <Sparkles size={14} /> Mark Cleaned & Reset
                        </button>
                      )}

                      <button
                        className="btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <Check size={14} /> Acknowledge
                      </button>
                    </div>
                  )}

                  {alert.resolved && (
                    <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle2 size={13} /> Resolved by floor staff
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
